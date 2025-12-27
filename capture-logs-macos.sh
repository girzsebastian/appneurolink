#!/bin/bash
# macOS Compatible Log Capture Script - BrainLink Neurofeedback

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  📊 BrainLink Neurofeedback - Log Capture (macOS)            ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Check adb
if ! command -v adb &> /dev/null; then
    echo "❌ adb not found"
    echo "💡 Install: brew install android-platform-tools"
    exit 1
fi

# Check device
if ! adb devices | grep -q "device$"; then
    echo "❌ No device connected"
    echo "💡 Connect device via USB and enable USB debugging"
    exit 1
fi

echo "✅ Device connected"
echo ""

# Clear logs
echo "1️⃣  Clearing old logs..."
adb logcat -c
echo "   ✅ Cleared"
echo ""

# Instructions
echo "2️⃣  Ready to capture:"
echo "   📱 In app: Navigate to Neurofeedback screen"
echo "   🔌 Click ⚡ icon to open connection modal"
echo "   🔍 Scan and connect to BrainLink_Pro"
echo "   📊 Logs will appear below"
echo "   ⏹️  Press Ctrl+C after capturing data to stop"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "LIVE LOGS:"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Save to temp file while displaying
LOG_FILE="/tmp/brainlink-neurofeedback-$(date +%Y%m%d-%H%M%S).log"

# Capture logs (will run until Ctrl+C)
# Filter for relevant BrainLink data: emojis, ReactNativeJS, BLE, etc.
adb logcat | tee "$LOG_FILE" | grep --line-buffered -E "❤️|🎯|🧘|🧠|📊|📶|✅|❌|⚠️|🔍|🔗|🔌|ReactNativeJS|BrainLink|BLE|Attention|Meditation|Signal|Brain Waves|Heart Rate"

# After Ctrl+C, show summary
echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📁 Full log saved to:"
echo "   $LOG_FILE"
echo ""
echo "💡 To analyze specific data:"
echo "   grep '🎯 Attention' $LOG_FILE    # View attention values"
echo "   grep '🧘 Meditation' $LOG_FILE   # View meditation values"
echo "   grep '❤️ Heart Rate' $LOG_FILE   # View heart rate data"
echo "   grep '🧠 Brain Waves' $LOG_FILE  # View brain wave data"
echo "   grep '❌' $LOG_FILE               # Check errors"
echo "   grep '⚠️' $LOG_FILE               # Check warnings"
echo "   grep 'Connected' $LOG_FILE        # Check connection status"
echo ""
echo "💡 To search for specific issues:"
echo "   grep -i 'error' $LOG_FILE         # All errors"
echo "   grep -i 'failed' $LOG_FILE        # All failures"
echo "   grep 'Exception' $LOG_FILE        # All exceptions"
echo ""
echo "💡 To view entire log:"
echo "   less $LOG_FILE"
echo "   # Press 'q' to quit"
echo "════════════════════════════════════════════════════════════════"

