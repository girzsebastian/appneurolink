# Games Directory

This directory contains individual game configurations and implementations.

## Structure

Each game has its own folder with the following structure:

```
games/
├── focus-racer/
│   └── config.ts          # Game-specific configuration
├── mindful-maze/
│   └── config.ts
├── concentration-catch/
│   └── config.ts
├── brain-balance/
│   └── config.ts
├── focus-flight/
│   └── config.ts
├── zen-garden/
│   └── config.ts
├── index.ts               # Game utilities and exports
└── README.md              # This file
```

## Game Settings

Each game starts with the following settings:

- **Score**: Starting score (default: 0)
- **Score Streak**: Starting streak count (default: 0)
- **Time**: Game duration in seconds (default: 150 = 2.5 minutes)
- **Base Attention**: Starting attention level (0-100, default: 50)
- **Dynamic**: Boolean flag to enable algorithmic difficulty adjustment (default: false)

## Game IDs

- `1` - Focus Racer
- `2` - Mindful Maze
- `3` - Concentration Catch
- `4` - Brain Balance
- `5` - Focus Flight
- `6` - Zen Garden

## Usage

```typescript
import { getGameConfig, GAME_IDS } from '../games';

// Get default config for a game
const config = getGameConfig(GAME_IDS.FOCUS_RACER);

// Or import specific game config
import { FOCUS_RACER_CONFIG } from '../games/focus-racer/config';
```

## Adding a New Game

1. Create a new folder in `games/` with a kebab-case name
2. Create `config.ts` with the game configuration
3. Export the config from `games/index.ts`
4. Add the game ID to `GAME_IDS` constant
5. Add the config to `GAME_CONFIGS` map

