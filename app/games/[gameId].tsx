import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useBrainLink } from '../../hooks/useBrainLink';
import { CircularProgress } from '../../components/CircularProgress';

export default function GameScreen() {
  const router = useRouter();
  const { gameId, gameTitle, baseAttention, isDynamic } = useLocalSearchParams();
  const { attention, isConnected } = useBrainLink();
  
  const [score, setScore] = useState(0);
  const [scoreStreak, setScoreStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(150); // 2.5 minutes
  const [gameActive, setGameActive] = useState(false);
  const [currentBaseAttention, setCurrentBaseAttention] = useState(
    baseAttention ? parseInt(baseAttention) : 50
  );
  const [dynamicMode] = useState(isDynamic === 'true');

  // Timer countdown
  useEffect(() => {
    if (!gameActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleGameEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeRemaining]);

  // Dynamic difficulty adjustment
  useEffect(() => {
    if (!gameActive || !dynamicMode || !isConnected) return;

    // Algorithm: Adjust base attention based on current performance
    // If attention is consistently above base, increase difficulty
    // If attention is consistently below base, decrease difficulty
    const attentionDiff = attention - currentBaseAttention;
    
    if (Math.abs(attentionDiff) > 10) {
      // Adjust base attention gradually
      const adjustment = attentionDiff > 0 ? 2 : -2;
      setCurrentBaseAttention((prev) => {
        const newValue = prev + adjustment;
        return Math.max(0, Math.min(100, newValue));
      });
    }
  }, [attention, gameActive, dynamicMode, isConnected, currentBaseAttention]);

  // Score calculation based on attention
  useEffect(() => {
    if (!gameActive || !isConnected) return;

    const checkInterval = setInterval(() => {
      if (attention >= currentBaseAttention) {
        // Player is meeting the requirement
        setScore((prev) => prev + 1);
        setScoreStreak((prev) => prev + 1);
      } else {
        // Player is below requirement - reset streak
        setScoreStreak(0);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [gameActive, isConnected, attention, currentBaseAttention]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect your BrainLink device first.');
      return;
    }
    setGameActive(true);
    setTimeRemaining(150);
    setScore(0);
    setScoreStreak(0);
  };

  const handlePause = () => {
    setGameActive(false);
  };

  const handleResume = () => {
    if (!isConnected) {
      Alert.alert('Not Connected', 'Please connect your BrainLink device first.');
      return;
    }
    setGameActive(true);
  };

  const handleGameEnd = () => {
    setGameActive(false);
    Alert.alert(
      'Game Over!',
      `Final Score: ${score}\nBest Streak: ${scoreStreak}\nTime: ${formatTime(150 - timeRemaining)}`,
      [
        {
          text: 'Play Again',
          onPress: () => {
            setTimeRemaining(150);
            setScore(0);
            setScoreStreak(0);
            handleStart();
          },
        },
        {
          text: 'Back to Menu',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleExit = () => {
    if (gameActive) {
      Alert.alert(
        'Exit Game?',
        'Are you sure you want to exit? Your progress will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleExit}>
          <Text style={styles.backButtonText}>← Exit</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{gameTitle || 'Game'}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>{scoreStreak}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Time</Text>
            <Text style={styles.statValue}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        {/* Attention Display */}
        <View style={styles.attentionContainer}>
          <CircularProgress
            value={attention}
            label="Current Attention"
            color="#06b6d4"
            size={250}
            strokeWidth={20}
          />
          <View style={styles.baseAttentionIndicator}>
            <Text style={styles.baseAttentionLabel}>Base: {currentBaseAttention}</Text>
            {dynamicMode && (
              <Text style={styles.dynamicLabel}>Dynamic Mode: ON</Text>
            )}
          </View>
        </View>

        {/* Game Status */}
        <View style={styles.statusContainer}>
          {!isConnected && (
            <Text style={styles.warningText}>
              ⚠️ Connect your BrainLink device to play
            </Text>
          )}
          {isConnected && !gameActive && (
            <Text style={styles.infoText}>
              Ready to start! Keep your attention above {currentBaseAttention}
            </Text>
          )}
          {gameActive && (
            <Text style={styles.activeText}>
              {attention >= currentBaseAttention ? '✅ Good!' : '⚠️ Focus more!'}
            </Text>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          {!gameActive ? (
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStart}
              disabled={!isConnected}
            >
              <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.pauseButton]}
              onPress={handlePause}
            >
              <Text style={styles.buttonText}>PAUSE</Text>
            </TouchableOpacity>
          )}
          {!gameActive && timeRemaining < 150 && (
            <TouchableOpacity
              style={[styles.button, styles.resumeButton]}
              onPress={handleResume}
              disabled={!isConnected}
            >
              <Text style={styles.buttonText}>RESUME</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statValue: {
    color: '#1e293b',
    fontSize: 28,
    fontWeight: 'bold',
  },
  attentionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  baseAttentionIndicator: {
    marginTop: 16,
    alignItems: 'center',
  },
  baseAttentionLabel: {
    color: '#1e293b',
    fontSize: 18,
    fontWeight: '600',
  },
  dynamicLabel: {
    color: '#06b6d4',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  statusContainer: {
    marginBottom: 32,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warningText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#06b6d4',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#06b6d4',
  },
  pauseButton: {
    backgroundColor: '#ef4444',
  },
  resumeButton: {
    backgroundColor: '#10b981',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

