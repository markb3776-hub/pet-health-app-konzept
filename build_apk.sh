#!/bin/bash
# simplyPet APK bauen
# Voraussetzung: ./setup_build_env.sh wurde ausgeführt

set -e

echo "=== simplyPet APK Build ==="

# Java finden
if [ -d "/usr/lib/jvm/jdk-17.0.11+9" ]; then
  export JAVA_HOME=/usr/lib/jvm/jdk-17.0.11+9
elif [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
  export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
else
  export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
fi

export ANDROID_HOME=/home/ubuntu/android-sdk
export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH

echo "JAVA_HOME=$JAVA_HOME"
echo "ANDROID_HOME=$ANDROID_HOME"

cd /home/ubuntu/simplypet_workspace/app/android
chmod +x gradlew

echo "Building..."
./gradlew assembleRelease --no-daemon -Dorg.gradle.jvmargs="-Xmx2g" 2>&1 | tail -10

# APK finden und in Workspace-Root kopieren
APK=$(find app/build/outputs/apk/release -name "*.apk" -type f | head -1)
if [ -n "$APK" ]; then
  FILENAME=$(basename "$APK")
  cp "$APK" /home/ubuntu/"$FILENAME"
  echo ""
  echo "=== BUILD ERFOLGREICH ==="
  echo "APK: /home/ubuntu/$FILENAME"
  ls -lh /home/ubuntu/"$FILENAME"
else
  echo "FEHLER: Keine APK gefunden!"
  exit 1
fi
