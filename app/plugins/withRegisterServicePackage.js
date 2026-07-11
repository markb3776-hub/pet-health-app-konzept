/**
 * Expo Config Plugin: Registriert EmergencyServicePackage in MainApplication (E-73)
 *
 * Patcht MainApplication.kt um das native Modul verfuegbar zu machen.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withRegisterServicePackage(config) {
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const mainAppPath = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'java',
        'de',
        'simplypet',
        'app',
        'MainApplication.kt'
      );

      if (!fs.existsSync(mainAppPath)) {
        // MainApplication wird von Expo generiert – wenn sie noch nicht existiert,
        // wird der Patch spaeter beim Build greifen
        return cfg;
      }

      let content = fs.readFileSync(mainAppPath, 'utf-8');

      // Pruefen ob bereits registriert
      if (content.includes('EmergencyServicePackage')) {
        return cfg;
      }

      // PackageList().packages erweitern
      // Expo generiert: override val packages: List<ReactPackage> get() = PackageList(this).packages
      // Wir muessen das Package zur Liste hinzufuegen
      if (content.includes('PackageList(this).packages')) {
        content = content.replace(
          'PackageList(this).packages',
          'PackageList(this).packages + listOf(EmergencyServicePackage())'
        );
      }

      fs.writeFileSync(mainAppPath, content, 'utf-8');
      return cfg;
    },
  ]);

  return config;
}

module.exports = withRegisterServicePackage;
