/**
 * Expo Config Plugin: Android Foreground Service (E-73)
 *
 * Erstellt einen nativen Android Foreground Service, der eine permanente,
 * nicht-wegwischbare Notification anzeigt. Verhalten wie ein Lichtschalter:
 * AN = Notification da, AUS = Notification weg.
 *
 * Dateien die nach Prebuild generiert werden:
 * - EmergencyForegroundService.kt (der Service)
 * - AndroidManifest.xml Eintraege (Service + Permission)
 */
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withForegroundService(config) {
  // Schritt 1: Kotlin-Service-Datei erstellen
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const packagePath = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        'de',
        'simplypet',
        'app'
      );

      if (!fs.existsSync(packagePath)) {
        fs.mkdirSync(packagePath, { recursive: true });
      }

      const serviceCode = `package com.simplydevapps.simplypet

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder

/**
 * Foreground Service fuer permanente Notfallpass-Notification (E-73).
 * Nicht wegwischbar, bleibt nach Antippen bestehen.
 * Wird nur gestartet wenn der Nutzer den Schalter auf AN stellt.
 */
class EmergencyForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "simplypet_emergency_fg"
        const val NOTIFICATION_ID = 7301
        const val ACTION_STOP = "com.simplydevapps.simplypet.STOP_EMERGENCY_FG"

        fun start(context: Context) {
            val intent = Intent(context, EmergencyForegroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            val intent = Intent(context, EmergencyForegroundService::class.java)
            context.stopService(intent)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        createChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_STOP) {
            stopForeground(STOP_FOREGROUND_REMOVE)
            stopSelf()
            return START_NOT_STICKY
        }

        val notification = buildNotification()
        startForeground(NOTIFICATION_ID, notification)

        // START_STICKY: Android startet den Service neu wenn er gekillt wird
        return START_STICKY
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Notfallpass-Schnellzugriff",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Permanenter Schnellzugriff auf den Notfallpass"
                setShowBadge(false)
                enableVibration(false)
                setSound(null, null)
                lockscreenVisibility = Notification.VISIBILITY_PUBLIC
            }

            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        // Intent: Tippe auf Notification -> LockScreenActivity (E-72: zeigt auch auf Sperrbildschirm)
        val openIntent = Intent(this, LockScreenActivity::class.java).apply {
            action = "com.simplydevapps.simplypet.OPEN_EMERGENCY"
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val builder = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Notification.Builder(this, CHANNEL_ID)
        } else {
            @Suppress("DEPRECATION")
            Notification.Builder(this)
        }

        return builder
            .setContentTitle("simplyPet Notfallpass")
            .setContentText("Tippe f\\u00fcr sofortigen Zugriff auf den Notfallpass.")
            .setSmallIcon(R.drawable.ic_notification)
            .setColor(0xFF2E9E83.toInt())
            .setContentIntent(pendingIntent)
            .setOngoing(true)       // NICHT wegwischbar
            .setAutoCancel(false)   // Bleibt nach Antippen stehen
            .setCategory(Notification.CATEGORY_SERVICE)
            .setVisibility(Notification.VISIBILITY_PUBLIC)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        stopForeground(STOP_FOREGROUND_REMOVE)
    }
}
`;

      fs.writeFileSync(
        path.join(packagePath, 'EmergencyForegroundService.kt'),
        serviceCode,
        'utf-8'
      );

      // Notification Small-Icon: Vorskalierte DPI-PNGs aus assets/notification-icons/ kopieren
      // Korrekte Größen: mdpi=24, hdpi=36, xhdpi=48, xxhdpi=72, xxxhdpi=96
      const iconsDir = path.join(cfg.modRequest.projectRoot, 'assets', 'notification-icons');
      const resBase = path.join(cfg.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res');
      const dpiSizes = [
        ['drawable-mdpi', 24],
        ['drawable-hdpi', 36],
        ['drawable-xhdpi', 48],
        ['drawable-xxhdpi', 72],
        ['drawable-xxxhdpi', 96],
      ];
      for (const [folder, size] of dpiSizes) {
        const src = path.join(iconsDir, `ic_notification_${size}.png`);
        const dir = path.join(resBase, folder);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(dir, 'ic_notification.png'));
        }
      }

      return cfg;
    },
  ]);

  // Schritt 2: AndroidManifest patchen – Service + Permission
  config = withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;

    // FOREGROUND_SERVICE Permission hinzufuegen
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    const hasFgPerm = manifest['uses-permission'].some(
      (p) => p.$?.['android:name'] === 'android.permission.FOREGROUND_SERVICE'
    );
    if (!hasFgPerm) {
      manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.FOREGROUND_SERVICE' },
      });
    }

    // FOREGROUND_SERVICE_SPECIAL_USE fuer Android 14+
    const hasFgSpecial = manifest['uses-permission'].some(
      (p) => p.$?.['android:name'] === 'android.permission.FOREGROUND_SERVICE_SPECIAL_USE'
    );
    if (!hasFgSpecial) {
      manifest['uses-permission'].push({
        $: { 'android:name': 'android.permission.FOREGROUND_SERVICE_SPECIAL_USE' },
      });
    }

    // Service im Application-Block registrieren
    const mainApp = manifest.application?.[0];
    if (mainApp) {
      if (!mainApp.service) {
        mainApp.service = [];
      }

      const hasService = mainApp.service.some(
        (s) => s.$?.['android:name'] === '.EmergencyForegroundService'
      );

      if (!hasService) {
        mainApp.service.push({
          $: {
            'android:name': '.EmergencyForegroundService',
            'android:enabled': 'true',
            'android:exported': 'false',
            'android:foregroundServiceType': 'specialUse',
          },
        });
      }
    }

    return cfg;
  });

  return config;
}

module.exports = withForegroundService;
