import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface AttentionJumpGameProps {
  attention: number;
  isConnected: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const ATTENTION_THRESHOLD = 60; // Jump when attention > 60
const POINTS_PER_INTERVAL = 10; // Points earned every 2 seconds
const INTERVAL_DURATION = 2000; // 2 seconds in milliseconds

export const AttentionJumpGame: React.FC<AttentionJumpGameProps> = ({
  attention,
  isConnected,
}) => {
  const [score, setScore] = useState(0);
  const [timeAboveThreshold, setTimeAboveThreshold] = useState(0);
  const jumpAnimation = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeAboveRef = useRef(0);

  // Jump animation when attention is above threshold
  useEffect(() => {
    if (!isConnected) return;

    if (attention > ATTENTION_THRESHOLD) {
      // Start jump animation
      Animated.sequence([
        Animated.timing(jumpAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(jumpAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [attention, isConnected]);

  // Track time above threshold and award points
  useEffect(() => {
    if (!isConnected) {
      // Reset when disconnected
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      timeAboveRef.current = 0;
      setTimeAboveThreshold(0);
      return;
    }

    // Check every 100ms
    intervalRef.current = setInterval(() => {
      if (attention > ATTENTION_THRESHOLD) {
        timeAboveRef.current += 100;
        setTimeAboveThreshold(timeAboveRef.current);

        // Award points every 2 seconds
        if (timeAboveRef.current % INTERVAL_DURATION === 0) {
          setScore((prev) => prev + POINTS_PER_INTERVAL);
        }
      } else {
        // Reset timer when attention drops
        timeAboveRef.current = 0;
        setTimeAboveThreshold(0);
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [attention, isConnected]);

  // Calculate jump height
  const translateY = jumpAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80], // Jump 80 pixels up
  });

  // Calculate square color based on attention level
  const getSquareColor = () => {
    if (!isConnected) return '#333';
    if (attention < 40) return '#ff4444'; // Low attention - red
    if (attention < ATTENTION_THRESHOLD) return '#ffaa00'; // Medium - orange
    return '#00ff00'; // High attention - green
  };

  const progressToNextPoint = (timeAboveThreshold % INTERVAL_DURATION) / INTERVAL_DURATION;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdLabel}>Threshold</Text>
          <Text style={styles.thresholdValue}>{ATTENTION_THRESHOLD}</Text>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Ground line */}
        <View style={styles.ground} />

        {/* Jumping Square */}
        <Animated.View
          style={[
            styles.square,
            {
              backgroundColor: getSquareColor(),
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.attentionText}>{attention}</Text>
        </Animated.View>

        {/* Threshold indicator line */}
        <View style={styles.thresholdLine}>
          <View style={styles.thresholdLineDashed} />
          <Text style={styles.thresholdLineText}>Jump Line</Text>
        </View>
      </View>

      {/* Progress Bar for Next Point */}
      {attention > ATTENTION_THRESHOLD && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            Next +{POINTS_PER_INTERVAL} points in {((INTERVAL_DURATION - timeAboveThreshold % INTERVAL_DURATION) / 1000).toFixed(1)}s
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressToNextPoint * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {!isConnected
            ? '🔌 Connect BrainLink to play'
            : attention <= ATTENTION_THRESHOLD
            ? '🧠 Increase your attention above ' + ATTENTION_THRESHOLD + ' to make the square jump!'
            : '✨ Great! Keep your attention high to earn points!'}
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current Attention</Text>
          <Text
            style={[
              styles.statValue,
              { color: attention > ATTENTION_THRESHOLD ? '#00ff00' : '#ff4444' },
            ]}
          >
            {attention}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Time Above</Text>
          <Text style={styles.statValue}>
            {(timeAboveThreshold / 1000).toFixed(1)}s
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#00ff00',
    fontSize: 32,
    fontWeight: 'bold',
  },
  thresholdContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  thresholdLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  thresholdValue: {
    color: '#ffaa00',
    fontSize: 32,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'relative',
    minHeight: 250,
  },
  ground: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: '#00ff00',
  },
  square: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  attentionText: {
    color: '#0a0a0a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  thresholdLine: {
    position: 'absolute',
    top: '30%',
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  thresholdLineDashed: {
    flex: 1,
    height: 2,
    backgroundColor: '#ffaa00',
    opacity: 0.5,
  },
  thresholdLineText: {
    color: '#ffaa00',
    fontSize: 10,
    marginLeft: 8,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 4,
  },
  progressContainer: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
  },
  progressLabel: {
    color: '#00ff00',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff00',
    borderRadius: 4,
  },
  instructions: {
    marginTop: 16,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  instructionText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

