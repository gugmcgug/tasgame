# TAS Game

A modern game development framework built with TypeScript and Vite, featuring a robust game loop, input management, and scene system.

## Features

- ⚡ **Lightning-fast development** with Vite hot module replacement
- 🎮 **Fixed timestep game loop** for consistent physics and gameplay
- 🎯 **Scene management system** for organizing game states
- ⌨️ **Comprehensive input handling** (keyboard and mouse)
- 📦 **Asset loading system** for images and audio
- 🎨 **TypeScript** for type safety and better developer experience
- 🏗️ **Modular architecture** with separate concerns (core, entities, scenes, utils)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
tasgame/
├── src/
│   ├── core/              # Core game engine
│   │   ├── Game.ts        # Main game class with game loop
│   │   ├── Scene.ts       # Base scene class
│   │   ├── GameState.ts   # Scene management
│   │   └── InputManager.ts # Input handling
│   ├── entities/          # Game entities
│   │   └── Player.ts      # Player character
│   ├── scenes/            # Game scenes
│   │   └── PlayScene.ts   # Main play scene
│   ├── utils/             # Utility classes
│   │   ├── Vector2D.ts    # 2D vector math
│   │   └── AssetLoader.ts # Asset loading
│   ├── main.ts            # Entry point
│   └── style.css          # Global styles
├── public/                # Static assets
│   └── assets/
│       ├── images/        # Image files
│       ├── audio/         # Audio files
│       └── fonts/         # Font files
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## Architecture

### Game Loop

The game uses a **fixed timestep** loop running at 60 FPS, ensuring consistent physics regardless of frame rate:

```typescript
// Fixed update for physics (always 60 FPS)
update(deltaTime: number): void

// Variable render with interpolation
render(alpha: number): void
```

### Scene System

Organize your game into different scenes (menu, gameplay, pause, etc.):

```typescript
class MyScene extends Scene {
  update(deltaTime: number, input: InputManager): void {
    // Update game logic
  }

  render(ctx: CanvasRenderingContext2D, alpha: number): void {
    // Render graphics
  }
}
```

### Input Handling

The `InputManager` provides comprehensive input detection:

```typescript
// Keyboard
input.isKeyDown('KeyW')        // Continuous hold
input.isKeyPressed('Space')    // Single frame press
input.isKeyReleased('Enter')   // Single frame release

// Mouse
input.getMousePosition()
input.isMouseButtonDown(0)     // Left click (hold)
input.isMouseButtonPressed(0)  // Left click (single frame)
```

### Asset Loading

Load images and audio asynchronously:

```typescript
const loader = new AssetLoader()
await loader.loadAssets(
  [{ key: 'player', path: '/assets/images/player.png' }],
  [{ key: 'bgm', path: '/assets/audio/music.mp3' }]
)

const playerImg = loader.getImage('player')
```

## Controls

- **WASD** or **Arrow Keys**: Move player
- **Mouse**: Track position (ready for interaction)

## Development

### Adding a New Scene

1. Create a new file in `src/scenes/`
2. Extend the `Scene` base class
3. Implement `update()` and `render()` methods
4. Push the scene to the game state:

```typescript
const newScene = new MyScene(width, height)
game.getState().pushScene(newScene)
```

### Adding Entities

1. Create entity class in `src/entities/`
2. Implement `update()` and `render()` methods
3. Add to a scene and manage in scene's update loop

### Performance Tips

- Use object pooling for frequently created/destroyed entities
- Implement spatial partitioning for collision detection
- Profile with browser DevTools
- The FPS counter displays in the top-left corner

## Building for Production

```bash
npm run build
```

This creates an optimized bundle in the `dist/` directory with:
- Minified JavaScript
- Optimized assets
- Source maps for debugging

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
