#!/bin/bash
# BrainLink Neurofeedback - Android Build Script
# Builds the release APK for the main application

echo "🚀 Building BrainLink Neurofeedback Android App..."
echo ""

# Navigate to android directory
cd android || exit 1

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Build release APK
echo "📦 Building release APK..."
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"
    echo ""
    
    # Copy APK to root directory for easy access
    cp app/build/outputs/apk/release/app-release.apk ../app-release.apk
    echo "📋 APK copied to: app-release.apk"
    echo ""
    echo "🎉 Ready to install!"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi

