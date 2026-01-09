import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function GameOptionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Game Options</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.card, styles.miniGamesCard]}
          onPress={() => router.push('/mini-games')}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>🎮</Text>
          </View>
          <Text style={styles.cardTitle}>MiniGames</Text>
          <Text style={styles.cardDescription}>
            Interactive games that respond to your attention levels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.videoCard]}
          onPress={() => {
            // Future: Video games
          }}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>📹</Text>
          </View>
          <Text style={styles.cardTitle}>Video</Text>
          <Text style={styles.cardDescription}>
            Watch videos controlled by your focus
          </Text>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
        </TouchableOpacity>
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
    color: '#0891b2',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    paddingHorizontal: 40,
  },
  card: {
    borderRadius: 24,
    padding: 40,
    width: 380,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  miniGamesCard: {
    backgroundColor: '#06b6d4',
  },
  videoCard: {
    backgroundColor: '#0891b2',
    opacity: 0.7,
  },
  cardIcon: {
    marginBottom: 24,
  },
  iconText: {
    fontSize: 80,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

