# Escape the Maze

A Next.js + TypeScript puzzle game where you generate and solve mazes using BFS, DFS, A*, or Backtracking algorithms. Visualize the solving process and try to escape the maze yourself!

## Features
- Procedurally generated perfect mazes
- Visualize BFS, DFS, A*, and Backtracking pathfinding
- Toggle visibility of visited nodes and final path
- Manually solve the maze with arrow keys or WASD

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Build for Production

```bash
npm run build
npm start
```

## Project Structure

- `/app/page.tsx` — Main game page
- `/components/MazeCanvas.tsx` — Canvas rendering and visualization
- `/components/Controls.tsx` — UI controls
- `/lib/mazeGenerator.ts` — Maze generation logic
- `/lib/algorithms/` — Pathfinding algorithms (BFS, DFS, A*, Backtracking)
- `/types/types.ts` — Type definitions

## License
MIT 