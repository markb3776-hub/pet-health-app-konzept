/**
 * Expo Config Plugin: Show-on-Lock-Screen (E-72)
 *
 * Erstellt eine transparente Activity die mit showWhenLocked=true und
 * turnScreenOn=true konfiguriert ist. Wenn diese Activity gestartet wird
 * (z.B. ueber die permanente Notification), zeigt sie den Notfallpass
 * OHNE dass das Geraet entsperrt werden muss.
 *
 * Technischer Ansatz:
 * - LockScreenActivity.kt: Transparente Activity mit showWhenLocked
 * - Oeffnet die Haupt-App mit einem Intent-Extra "show_emergency_pass"
 * - AndroidManifest.xml: Activity-Eintrag mit exported=true
 *
 * Dateien die nach Prebuild generiert werden:
 * - LockScreenActivity.kt
 * - AndroidManifest.xml Eintrag
 */
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withShowOnLockScreen(config) {
  // Schritt 1: Kotlin Activity-Datei erstellen
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

      const activityCode = `package de.simplypet.app

import android.app.Activity
import android.app.KeyguardManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowManager

/**
 * Transparente Activity die den Notfallpass auf dem Sperrbildschirm anzeigt (E-72).
 *
 * Wird ueber die permanente Notification oder einen App-Shortcut gestartet.
 * Zeigt sich UEBER dem Sperrbildschirm, ohne dass der Nutzer entsperren muss.
 * Leitet dann an die Haupt-Activity weiter mit dem Intent-Extra "show_emergency_pass".
 */
class LockScreenActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Auf dem Sperrbildschirm anzeigen
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            // Keyguard (Sperrbildschirm) deaktivieren fuer diese Activity
            val keyguardManager = getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD
            )
        }

        // Haupt-Activity starten mit OPEN_EMERGENCY Action (wird von intentHandler.ts erkannt)
        val mainIntent = Intent(this, MainActivity::class.java).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            action = "de.simplypet.app.OPEN_EMERGENCY"
        }
        startActivity(mainIntent)

        // Diese Activity sofort beenden (sie ist nur ein Trampolin)
        finish()
    }
}
`;

      const activityFilePath = path.join(packagePath, 'LockScreenActivity.kt');
      fs.writeFileSync(activityFilePath, activityCode);
      return cfg;
    },
  ]);

  // Schritt 2: AndroidManifest.xml um die LockScreenActivity erweitern
  config = withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults;
    const application = manifest.manifest.application?.[0];
    if (!application) return cfg;

    // Pruefen ob Activity bereits existiert
    const activities = application.activity ?? [];
    const exists = activities.some(
      (a) => a.$?.['android:name'] === '.LockScreenActivity'
    );

    if (!exists) {
      activities.push({
        $: {
          'android:name': '.LockScreenActivity',
          'android:exported': 'true',
          'android:theme': '@android:style/Theme.Translucent.NoTitleBar',
          'android:noHistory': 'true',
          'android:excludeFromRecents': 'true',
          'android:taskAffinity': '',
          'android:launchMode': 'singleInstance',
        },
      });
      application.activity = activities;
    }

    return cfg;
  });

  return config;
}

module.exports = withShowOnLockScreen;
