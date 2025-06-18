# 3D FPS Game

A simple 3D first-person shooter game built with Vite, TypeScript, and React Three Fiber.

## Features

- 3D environment with physics simulation
- First-person camera controls with pointer lock
- WASD movement controls
- Physics-based collision detection
- Interactive 3D objects (cubes) that respond to physics
- Sky background and ambient lighting

## Controls

- **Click** to lock the mouse pointer
- **WASD** keys to move around
- **Mouse** to look around
- **ESC** to unlock the pointer

## Technologies Used

- [Vite](https://vitejs.dev/) - Build tool
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React](https://reactjs.org/) - UI framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [React Three Drei](https://github.com/pmndrs/drei) - Useful helpers for React Three Fiber
- [React Three Cannon](https://github.com/pmndrs/use-cannon) - Physics engine

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

4. Click in the browser window to lock the pointer and start playing!

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.
