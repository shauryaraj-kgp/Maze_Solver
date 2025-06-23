# Maze Solver

A Next.js + TypeScript application that visualizes pathfinding algorithms through interactive maze solving. Compare the performance of BFS, DFS, A*, and Backtracking algorithms in real-time with beautiful animations and performance tracking.

## Features

### 🎯 **Algorithm Visualization**
- **Breadth-First Search (BFS)** - Explores level by level
- **Depth-First Search (DFS)** - Explores deep paths first
- **A* Algorithm** - Heuristic-based optimal pathfinding
- **Backtracking** - Systematic exploration with backtracking

### ⏱️ **Performance Tracking**
- **Real-time timer** with microsecond precision
- **Algorithm rankings** showing fastest to slowest
- **Visit count tracking** for efficiency comparison
- **Path length measurement** for optimality analysis

### 🎮 **Interactive Experience**
- **Manual navigation** using arrow keys or WASD
- **Procedurally generated mazes** with 50 extra paths
- **Real-time visualization** of algorithm exploration
- **Beautiful dark theme** with neon accents

### 🎨 **Modern UI/UX**
- **Welcome page** with feature showcase
- **Two-panel layout** for optimal workspace
- **Responsive design** for all screen sizes
- **Smooth animations** and hover effects

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Maze_Solver
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## How to Use

### 🏠 **Homepage (`/`)**
- Browse feature cards to understand capabilities
- Read instructions on how the application works
- Click "Start Maze Solver" to begin

### 🧩 **Maze Solver (`/maze`)**
1. **Choose Algorithm** - Select from 4 pathfinding algorithms
2. **Generate Maze** - Create a new maze with random complexity
3. **Solve Maze** - Watch the algorithm find the optimal path
4. **Compare Performance** - View rankings and timing data
5. **Manual Play** - Use keyboard controls to solve manually

## Project Structure

```
Maze_Solver/
├── app/
│   ├── page.tsx              # Homepage component
│   ├── maze/
│   │   └── page.tsx          # Maze solver page
│   └── layout.tsx            # Root layout
├── components/
│   └── MazeCanvas.tsx        # Canvas rendering component
├── lib/
│   ├── algorithms/
│   │   ├── bfs.ts           # Breadth-First Search
│   │   ├── dfs.ts           # Depth-First Search
│   │   ├── astar.ts         # A* Algorithm
│   │   └── backtracking.ts  # Backtracking
│   └── mazeGenerator.ts     # Maze generation logic
├── styles/
│   ├── globals.css          # Base styles
│   ├── home.css             # Homepage styles
│   └── maze.css             # Maze page styles
└── types/
    └── types.ts             # TypeScript definitions
```

## Technical Details

### **Algorithms Implemented**
- **BFS**: Uses queue, guarantees shortest path
- **DFS**: Uses stack, explores deep paths first
- **A***: Uses heuristic + cost, optimal pathfinding
- **Backtracking**: Systematic exploration with memory

### **Performance Features**
- **High-precision timing** using `performance.now()`
- **RequestAnimationFrame** for smooth 60fps updates
- **Real-time performance tracking** and rankings
- **Memory-efficient** canvas rendering

### **Styling Architecture**
- **Modular CSS** - Separate files for each page
- **Modern dark theme** with blue/purple gradients
- **Responsive design** with mobile-first approach
- **CSS Grid & Flexbox** for layouts

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Canvas API** - High-performance graphics
- **CSS3** - Modern styling with gradients and animations
- **Performance API** - High-precision timing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by classic maze solving algorithms
- Built for educational purposes in algorithm visualization
- Designed to help understand pathfinding concepts 