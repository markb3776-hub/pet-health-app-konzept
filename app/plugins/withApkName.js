/**
 * Expo Config Plugin: Konsistenter APK-Dateiname (E-91)
 *
 * Setzt den Output-Dateinamen auf: simplyPet_v{versionName}.apk
 * Damit ist der Dateiname immer konsistent, egal wer baut.
 *
 * Schema: simplyPet_v0.1.5.apk (camelCase App-Name + Semantic Version)
 */
const { withAppBuildGradle } = require('expo/config-plugins');

function withApkName(config) {
  return withAppBuildGradle(config, (cfg) => {
    const gradle = cfg.modResults.contents;

    // Prüfen ob applicationVariants-Block bereits existiert
    if (gradle.includes('applicationVariants.all')) {
      return cfg;
    }

    // Block vor dem schließenden "}" des android-Blocks einfügen
    const apkNameBlock = `
    applicationVariants.all { variant ->
        variant.outputs.all {
            outputFileName = "simplyPet_v\${variant.versionName}.apk"
        }
    }`;

    // Finde das letzte "}" des android-Blocks (nach androidResources)
    const androidResourcesEnd = gradle.indexOf("ignoreAssetsPattern '!.svn:");
    if (androidResourcesEnd !== -1) {
      // Finde das nächste "}" nach androidResources
      const afterResources = gradle.indexOf('}', gradle.indexOf('}', androidResourcesEnd) + 1);
      if (afterResources !== -1) {
        cfg.modResults.contents =
          gradle.slice(0, afterResources) +
          apkNameBlock + '\n' +
          gradle.slice(afterResources);
      }
    }

    return cfg;
  });
}

module.exports = withApkName;
