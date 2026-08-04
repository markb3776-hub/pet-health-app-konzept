const { withAndroidManifest } = require('expo/config-plugins');

/**
 * Entfernt angegebene Android-Permissions aus dem generierten Manifest,
 * unabhängig davon, welche Library sie transitiv einschleust.
 * Läuft bei jedem `expo prebuild`, greift also sowohl im APK- als auch im AAB-Build.
 *
 * Nutzung in app.json:
 *   ["./plugins/withRemovePermissions", ["android.permission.DUMP"]]
 */
module.exports = function withRemovePermissions(config, permissionsToRemove = []) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    if (manifest['uses-permission']) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (perm) => !permissionsToRemove.includes(perm['$']['android:name'])
      );
    }
    return config;
  });
};
