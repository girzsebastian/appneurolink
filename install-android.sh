#!/bin/bash
# BrainLink Neurofeedback - Android Install Script
# Installs the release APK on connected Android device

echo "📱 Installing BrainLink Neurofeedback on Android device..."
echo ""

# Check if device is connected
adb devices | grep -w "device" > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ No Android device connected!"
    echo "💡 Please connect your device and enable USB debugging"
    exit 1
fi

# Check if APK exists
if [ ! -f "app-release.apk" ]; then
    echo "❌ APK not found!"
    echo "💡 Please run ./build-android.sh first"
    exit 1
fi

# Install APK
echo "📲 Installing APK..."
adb install -r app-release.apk

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation successful!"
    echo "🎮 You can now open the BrainLink Neurofeedback app on your device"
else
    echo ""
    echo "❌ Installation failed!"
    exit 1
fi

