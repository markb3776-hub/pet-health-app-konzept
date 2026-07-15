#!/bin/bash
# simplyPet Build-Umgebung Setup
# Einmal ausführen nach Sandbox-Reset: ./setup_build_env.sh
# Danach: ./build_apk.sh

set -e

echo "=== simplyPet Build-Umgebung Setup ==="

# 1. JDK 17 installieren (falls nicht vorhanden)
if [ ! -d "/usr/lib/jvm/java-17-openjdk-amd64" ] && [ ! -d "/usr/lib/jvm/jdk-17.0.11+9" ]; then
  echo "JDK 17 nicht gefunden – verwende JDK 21 als Fallback..."
  export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
else
  export JAVA_HOME=$(ls -d /usr/lib/jvm/jdk-17* /usr/lib/jvm/java-17* 2>/dev/null | head -1)
fi
echo "JAVA_HOME=$JAVA_HOME"

# 2. Android SDK installieren (falls nicht vorhanden)
export ANDROID_HOME=/home/ubuntu/android-sdk
if [ ! -d "$ANDROID_HOME/platforms" ]; then
  echo "Android SDK installieren..."
  mkdir -p $ANDROID_HOME/cmdline-tools
  cd $ANDROID_HOME/cmdline-tools
  wget -q "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -O cmdtools.zip
  unzip -q cmdtools.zip
  mv cmdline-tools latest 2>/dev/null || true
  rm -f cmdtools.zip
  yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses > /dev/null 2>&1
  $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME \
    "platforms;android-35" "build-tools;35.0.0" "platform-tools" 2>&1 | tail -3
  echo "Android SDK installiert."
else
  echo "Android SDK bereits vorhanden."
fi

# 3. npm install
cd /home/ubuntu/simplypet_workspace/app
if [ ! -d "node_modules" ]; then
  echo "npm install..."
  npm install --legacy-peer-deps 2>&1 | tail -3
else
  echo "node_modules bereits vorhanden."
fi

# 4. Expo Prebuild
if [ ! -f "android/gradlew" ]; then
  echo "Expo prebuild..."
  npx expo prebuild --platform android --clean 2>&1 | tail -3
else
  echo "android/ bereits vorhanden."
fi

echo ""
echo "=== Setup abgeschlossen ==="
echo "Jetzt: ./build_apk.sh"
