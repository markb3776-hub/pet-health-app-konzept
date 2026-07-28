/**
 * Expo Config Plugin: Bridge-Modul fuer Foreground Service (E-73)
 *
 * Erstellt ein React Native Native Module (Kotlin), das den
 * EmergencyForegroundService aus JavaScript starten/stoppen kann.
 *
 * Aufruf aus JS:
 *   NativeModules.EmergencyServiceBridge.startService()
 *   NativeModules.EmergencyServiceBridge.stopService()
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withForegroundServiceBridge(config) {
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

      // Bridge Module
      const bridgeCode = `package com.simplydevapps.simplypet

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class EmergencyServiceBridge(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "EmergencyServiceBridge"

    @ReactMethod
    fun startService(promise: Promise) {
        try {
            EmergencyForegroundService.start(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SERVICE_ERROR", e.message)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            EmergencyForegroundService.stop(reactApplicationContext)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SERVICE_ERROR", e.message)
        }
    }
}
`;

      // Package registrieren
      const packageCode = `package com.simplydevapps.simplypet

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class EmergencyServicePackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(EmergencyServiceBridge(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
`;

      fs.writeFileSync(
        path.join(packagePath, 'EmergencyServiceBridge.kt'),
        bridgeCode,
        'utf-8'
      );

      fs.writeFileSync(
        path.join(packagePath, 'EmergencyServicePackage.kt'),
        packageCode,
        'utf-8'
      );

      return cfg;
    },
  ]);

  return config;
}

module.exports = withForegroundServiceBridge;
