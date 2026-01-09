#!/bin/bash
# BrainLink Neurofeedback - Build and Install Script
# Complete workflow: Clean, Build, and Install

echo "🚀 BrainLink Neurofeedback - Build and Install"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Build
echo "📦 Step 1: Building APK..."
./build-android.sh
if [ $? -ne 0 ]; then
    echo "❌ Build failed! Stopping..."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 2: Install
echo "📲 Step 2: Installing on device..."
./install-android.sh
if [ $? -ne 0 ]; then
    echo "❌ Installation failed!"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 All done! App is ready to use!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"



