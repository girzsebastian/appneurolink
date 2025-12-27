import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MiniGame } from '../types';
import { GameCard } from '../components/GameCard';

// Mock game data
const MINI_GAMES: MiniGame[] = [
  {
    id: 'attention-jump',
    title: 'Attention Jump',
    image: require('../assets/game-placeholder.png'),
    description: 'Make the square jump with your attention!',
  },
  {
    id: '1',
    title: 'Focus Racer',
    image: require('../assets/game-placeholder.png'),
    description: 'Race car controlled by your attention',
  },
  {
    id: '2',
    title: 'Mindful Maze',
    image: require('../assets/game-placeholder.png'),
    description: 'Navigate mazes with your focus',
  },
  {
    id: '3',
    title: 'Concentration Catch',
    image: require('../assets/game-placeholder.png'),
    description: 'Catch objects using attention',
  },
  {
    id: '4',
    title: 'Brain Balance',
    image: require('../assets/game-placeholder.png'),
    description: 'Balance objects with mental focus',
  },
  {
    id: '5',
    title: 'Focus Flight',
    image: require('../assets/game-placeholder.png'),
    description: 'Fly through obstacles',
  },
  {
    id: '6',
    title: 'Zen Garden',
    image: require('../assets/game-placeholder.png'),
    description: 'Grow plants with concentration',
  },
];

export default function MiniGamesScreen() {
  const router = useRouter();

  const handleGamePress = (game: MiniGame) => {
    // Direct route for Attention Jump game
    if (game.id === 'attention-jump') {
      router.push('/attention-jump');
      return;
    }
    
    // Other games go to detail page
    router.push({
      pathname: '/game-detail',
      params: { gameId: game.id, gameTitle: game.title },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>MiniGames</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <View style={styles.gamesGrid}>
        {MINI_GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPress={() => handleGamePress(game)}
          />
        ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
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
    backgroundColor: '#2a2a3e',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 80,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 20,
  },
});

