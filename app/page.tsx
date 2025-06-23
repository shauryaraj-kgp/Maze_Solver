'use client';
import React, { useState, useRef } from 'react';
import MazeCanvas from '../components/MazeCanvas';
import { generateMaze } from '../lib/mazeGenerator';
import { bfs } from '../lib/algorithms/bfs';
import { dfs } from '../lib/algorithms/dfs';
import { aStar } from '../lib/algorithms/astar';
import { backtracking } from '../lib/algorithms/backtracking';
import { Cell, Coord, Step } from '../types/types';

const ROWS = 15;
const COLS = 20;
const ALGORITHMS = [
    { name: 'BFS', fn: bfs, description: 'Breadth-First Search' },
    { name: 'DFS', fn: dfs, description: 'Depth-First Search' },
    { name: 'A*', fn: aStar, description: 'A* Algorithm' },
    { name: 'Backtracking', fn: backtracking, description: 'Backtracking' },
];

export default function Home() {
    const [grid, setGrid] = useState<Cell[][]>(() => generateMaze(ROWS, COLS, 50));
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('BFS');
    const [visited, setVisited] = useState<Step[]>([]);
    const [path, setPath] = useState<Step[]>([]);
    const [showVisited, setShowVisited] = useState(true);
    const [showPath, setShowPath] = useState(true);
    const [isSolving, setIsSolving] = useState(false);
    const [player, setPlayer] = useState<Coord>({ row: 0, col: 0 });
    const animationRef = useRef<number | null>(null);

    // Generate a new maze
    const handleGenerate = () => {
        setGrid(generateMaze(ROWS, COLS, 50));
        setVisited([]);
        setPath([]);
        setPlayer({ row: 0, col: 0 });
        setIsSolving(false);
    };

    // Animate the pathfinding steps
    const animateSteps = (visitedSteps: Step[], pathSteps: Step[]) => {
        setIsSolving(true);
        setVisited([]);
        setPath([]);
        let v = 0;
        let p = 0;
        const animate = () => {
            if (v < visitedSteps.length) {
                setVisited(visitedSteps.slice(0, v + 1));
                v++;
                animationRef.current = window.setTimeout(animate, 12);
            } else if (p < pathSteps.length) {
                setPath(pathSteps.slice(0, p + 1));
                p++;
                animationRef.current = window.setTimeout(animate, 32);
            } else {
                setIsSolving(false);
            }
        };
        animate();
    };

    // Start pathfinding
    const handleStart = () => {
        if (isSolving) return;
        const start: Coord = { row: 0, col: 0 };
        const end: Coord = { row: ROWS - 1, col: COLS - 1 };
        const algo = ALGORITHMS.find(a => a.name === selectedAlgorithm);
        if (!algo) return;
        const { visited: visitedSteps, path: pathSteps } = algo.fn(grid, start, end);
        animateSteps(visitedSteps, pathSteps);
    };

    // Player movement with arrow keys/WASD
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isSolving) return;
            const { row, col } = player;
            let nRow = row, nCol = col;
            if (e.key === 'ArrowUp' || e.key === 'w') nRow--;
            if (e.key === 'ArrowDown' || e.key === 's') nRow++;
            if (e.key === 'ArrowLeft' || e.key === 'a') nCol--;
            if (e.key === 'ArrowRight' || e.key === 'd') nCol++;
            if (
                nRow >= 0 && nRow < ROWS &&
                nCol >= 0 && nCol < COLS &&
                !grid[row][col].walls[
                nRow < row ? 'top' : nRow > row ? 'bottom' : nCol < col ? 'left' : nCol > col ? 'right' : 'top'
                ]
            ) {
                setPlayer({ row: nRow, col: nCol });
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [player, grid, isSolving]);

    // Clean up animation on unmount
    React.useEffect(() => {
        return () => {
            if (animationRef.current) clearTimeout(animationRef.current);
        };
    }, []);

    return (
        <div className="container">
            <div className="left-panel">
                <div className="header">
                    <h1 className="title">Maze Solver</h1>
                    <p className="subtitle">Visualize pathfinding algorithms</p>
                </div>

                <div className="controls-section">
                    <h2 className="section-title">Choose Algorithm</h2>
                    <div className="algorithms-grid">
                        {ALGORITHMS.map(algo => (
                            <button
                                key={algo.name}
                                onClick={() => setSelectedAlgorithm(algo.name)}
                                className={`algorithm-btn ${selectedAlgorithm === algo.name ? 'active' : ''}`}
                                disabled={isSolving}
                            >
                                {algo.name}
                            </button>
                        ))}
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={handleGenerate}
                            className="btn btn-primary"
                            disabled={isSolving}
                        >
                            Generate New Maze
                        </button>
                        <button
                            onClick={handleStart}
                            className="btn btn-secondary"
                            disabled={isSolving}
                        >
                            Solve Maze
                        </button>
                    </div>
                </div>

                <div className="instructions">
                    <h3>How to Use</h3>
                    <ul>
                        <li>Select an algorithm from the buttons above</li>
                        <li>Click "Generate New Maze" to create a new puzzle</li>
                        <li>Click "Solve Maze" to watch the algorithm in action</li>
                        <li>Use arrow keys or WASD to navigate manually</li>
                        <li>Green square is the start, red square is the goal</li>
                        <li>Blue path shows the optimal solution</li>
                    </ul>
                </div>
            </div>

            <div className="right-panel">
                <MazeCanvas
                    grid={grid}
                    visited={visited}
                    path={path}
                    showVisited={showVisited}
                    showPath={showPath}
                    player={player}
                    cellSize={32}
                />
            </div>
        </div>
    );
} 