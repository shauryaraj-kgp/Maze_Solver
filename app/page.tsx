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
    { name: 'BFS', fn: bfs },
    { name: 'DFS', fn: dfs },
    { name: 'A*', fn: aStar },
    { name: 'Backtracking', fn: backtracking },
];

export default function Home() {
    const [extraPaths, setExtraPaths] = useState(10);
    const [grid, setGrid] = useState<Cell[][]>(() => generateMaze(ROWS, COLS, 10));
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
        setGrid(generateMaze(ROWS, COLS, extraPaths));
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
        <div className="w-full max-w-3xl mx-auto py-8 px-4 flex flex-col items-center gap-8">
            <h1 className="text-3xl font-bold text-center mb-4">Escape the Maze</h1>
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
                <label className="flex items-center gap-2">
                    Algorithm:
                    <select
                        value={selectedAlgorithm}
                        onChange={e => setSelectedAlgorithm(e.target.value)}
                        className="text-black px-2 py-1 rounded"
                    >
                        {ALGORITHMS.map(a => (
                            <option key={a.name} value={a.name}>{a.name}</option>
                        ))}
                    </select>
                </label>
                <label className="flex items-center gap-2">
                    Extra Paths:
                    <input
                        type="number"
                        min={0}
                        max={Math.floor((ROWS * COLS) / 2)}
                        value={extraPaths}
                        onChange={e => setExtraPaths(Number(e.target.value))}
                        className="text-black px-2 py-1 rounded w-16"
                    />
                </label>
                <button
                    onClick={handleGenerate}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    disabled={isSolving}
                >
                    Generate Maze
                </button>
                <button
                    onClick={handleStart}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    disabled={isSolving}
                >
                    Solve
                </button>
            </div>
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
    );
} 