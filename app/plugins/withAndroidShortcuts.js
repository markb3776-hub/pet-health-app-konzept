/**
 * Expo Config Plugin: Android App-Shortcuts (E-61)
 *
 * Fuegt nach Prebuild eine shortcuts.xml hinzu und patcht das AndroidManifest,
 * damit "Lang druecken auf App-Icon -> Notfallpass" funktioniert.
 *
 * Der Shortcut oeffnet die MainActivity mit einem speziellen Intent,
 * das in App.tsx abgefangen wird um zum Notfallpass zu navigieren.
 */
const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withAndroidShortcuts(config) {
  // Schritt 1: shortcuts.xml und String-Ressourcen erstellen
  config = withDangerousMod(config, [
    'android',
    async (cfg) => {
      const resDir = path.join(
        cfg.modRequest.platformProjectRoot,
        'app',
        'src',
        'main',
        'res'
      );

      // xml-Ordner erstellen
      const xmlDir = path.join(resDir, 'xml');
      if (!fs.existsSync(xmlDir)) {
        fs.mkdirSync(xmlDir, { recursive: true });
      }

      // shortcuts.xml schreiben
      const shortcutsXml = `<?xml version="1.0" encoding="utf-8"?>
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
    <shortcut
        android:shortcutId="open_emergency_pass"
        android:enabled="true"
        android:icon="@mipmap/ic_launcher"
        android:shortcutShortLabel="@string/shortcut_emergency_short"
        android:shortcutLongLabel="@string/shortcut_emergency_long">
        <intent
            android:action="de.simplypet.app.OPEN_EMERGENCY"
            android:targetPackage="de.simplypet.app"
            android:targetClass="de.simplypet.app.MainActivity" />
        <categories android:name="android.shortcut.conversation" />
    </shortcut>
</shortcuts>`;

      fs.writeFileSync(path.join(xmlDir, 'shortcuts.xml'), shortcutsXml, 'utf-8');

      // String-Ressourcen fuer Shortcut-Labels
      const valuesDir = path.join(resDir, 'values');
      if (!fs.existsSync(valuesDir)) {
        fs.mkdirSync(valuesDir, { recursive: true });
      }

      const stringsPath = path.join(valuesDir, 'strings.xml');
      let stringsContent;
      if (fs.existsSync(stringsPath)) {
        stringsContent = fs.readFileSync(stringsPath, 'utf-8');
        if (!stringsContent.includes('shortcut_emergency_short')) {
          stringsContent = stringsContent.replace(
            '</resources>',
            '    <string name="shortcut_emergency_short">Notfallpass</string>\n' +
            '    <string name="shortcut_emergency_long">Notfallpass \\u00f6ffnen</string>\n' +
            '</resources>'
          );
          fs.writeFileSync(stringsPath, stringsContent, 'utf-8');
        }
      } else {
        stringsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="shortcut_emergency_short">Notfallpass</string>
    <string name="shortcut_emergency_long">Notfallpass \\u00f6ffnen</string>
</resources>
`;
        fs.writeFileSync(stringsPath, stringsContent, 'utf-8');
      }

      return cfg;
    },
  ]);

  // Schritt 2: AndroidManifest patchen – Intent-Filter + meta-data
  config = withAndroidManifest(config, (cfg) => {
    const mainApp = cfg.modResults.manifest.application?.[0];
    if (!mainApp) return cfg;

    const activities = mainApp.activity || [];
    const mainActivity = activities.find(
      (a) => a.$?.['android:name'] === '.MainActivity'
    );

    if (mainActivity) {
      if (!mainActivity['intent-filter']) {
        mainActivity['intent-filter'] = [];
      }

      const hasShortcutFilter = mainActivity['intent-filter'].some(
        (f) =>
          f.action?.some(
            (a) => a.$?.['android:name'] === 'de.simplypet.app.OPEN_EMERGENCY'
          )
      );

      if (!hasShortcutFilter) {
        mainActivity['intent-filter'].push({
          action: [{ $: { 'android:name': 'de.simplypet.app.OPEN_EMERGENCY' } }],
          category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        });
      }

      if (!mainActivity['meta-data']) {
        mainActivity['meta-data'] = [];
      }

      const hasShortcutMeta = mainActivity['meta-data'].some(
        (m) => m.$?.['android:name'] === 'android.app.shortcuts'
      );

      if (!hasShortcutMeta) {
        mainActivity['meta-data'].push({
          $: {
            'android:name': 'android.app.shortcuts',
            'android:resource': '@xml/shortcuts',
          },
        });
      }
    }

    return cfg;
  });

  return config;
}

module.exports = withAndroidShortcuts;
