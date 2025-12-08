# Assets Directory

This directory should contain all image assets for the BrainLink Neurofeedback app.

## Required Assets

### App Icons

1. **icon.png** (1024x1024 px)
   - Main app icon
   - Should feature the BrainLink logo or brain/neurofeedback imagery
   - Used for iOS and Android

2. **adaptive-icon.png** (1024x1024 px)
   - Android adaptive icon foreground
   - Should have transparent background
   - Content should fit within safe zone (inner 66%)

3. **favicon.png** (48x48 px)
   - Web favicon
   - Small, recognizable icon

### Splash Screen

4. **splash.png** (1284x2778 px for iPhone 14 Pro Max)
   - Displayed while app loads
   - Landscape orientation
   - Background color: #1a1a2e (matches app theme)
   - Should include app logo/name centered

### Game Assets

5. **game-placeholder.png** (multiple needed)
   - Game card images (recommended: 560x400 px)
   - One image per mini-game:
     - Focus Racer
     - Mindful Maze
     - Concentration Catch
     - Brain Balance
     - Focus Flight
     - Zen Garden

## Design Guidelines

### Color Palette

- **Primary Background**: #1a1a2e (dark blue-grey)
- **Secondary Background**: #2a2a3e (lighter grey)
- **Primary Accent**: #4CAF50 (green)
- **Secondary Accents**: 
  - #FF6B6B (red/pink)
  - #4ECDC4 (turquoise)
  - #9B59B6 (purple)

### Style

- Modern, clean design
- Neuroscience/technology themed
- Brain wave patterns as decorative elements
- Professional yet approachable

## Image Formats

- Use PNG for all assets (supports transparency)
- Optimize file sizes for mobile
- Use @2x and @3x variants for better quality on high-DPI screens (optional)

## Example File Structure

```
assets/
├── icon.png
├── adaptive-icon.png
├── favicon.png
├── splash.png
├── games/
│   ├── focus-racer.png
│   ├── mindful-maze.png
│   ├── concentration-catch.png
│   ├── brain-balance.png
│   ├── focus-flight.png
│   └── zen-garden.png
└── README.md (this file)
```

## Tools for Creating Assets

- **Figma**: Design and export assets
- **Adobe XD**: UI/UX design
- **Canva**: Quick graphic creation
- **TinyPNG**: Optimize PNG file sizes
- **ImageMagick**: Batch resize/convert images

## Temporary Placeholders

During development, you can use:
- Placeholder icon generators (e.g., makeappicon.com)
- Unsplash/Pexels for temporary game images (ensure licensing for production)
- Generated gradients for splash screens

