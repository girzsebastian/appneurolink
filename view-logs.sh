#!/bin/bash
# BrainLink Neurofeedback - Log Viewer
# View real-time logs from the Android app

echo "📊 Viewing BrainLink Neurofeedback logs..."
echo "Press Ctrl+C to stop"
echo ""

# Filter for app logs and BrainLink specific logs
adb logcat | grep -E "(ReactNativeJS|BrainLink|❤️|🎯|🧘|🧠|📊)"

