'use client';
import React, { useState, useRef, useEffect } from 'react';
import MazeCanvas from '../../components/MazeCanvas';
import { generateMaze } from '../../lib/mazeGenerator';
import { bfs } from '../../lib/algorithms/bfs';
import { dfs } from '../../lib/algorithms/dfs';
import { aStar } from '../../lib/algorithms/astar';
import { backtracking } from '../../lib/algorithms/backtracking';
import { Cell, Coord, Step } from '../../types/types';
import '../../styles/maze.css';

const ROWS = 15;
const COLS = 20;
const ALGORITHMS = [
    { name: 'BFS', fn: bfs, description: 'Breadth-First Search' },
    { name: 'DFS', fn: dfs, description: 'Depth-First Search' },
    { name: 'A*', fn: aStar, description: 'A* Algorithm' },
    { name: 'Backtracking', fn: backtracking, description: 'Backtracking' },
];

interface PerformanceRecord {
    algorithm: string;
    time: number;
    visitedCount: number;
    pathLength: number;
    timestamp: Date;
}

export default function MazePage() {
    const [grid, setGrid] = useState<Cell[][]>(() => generateMaze(ROWS, COLS, 50));
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('BFS');
    const [visited, setVisited] = useState<Step[]>([]);
    const [path, setPath] = useState<Step[]>([]);
    const [showVisited, setShowVisited] = useState(true);
    const [showPath, setShowPath] = useState(true);
    const [isSolving, setIsSolving] = useState(false);
    const [player, setPlayer] = useState<Coord>({ row: 0, col: 0 });
    const [timer, setTimer] = useState<number>(0);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
    const animationRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);

    // Timer effect
    useEffect(() => {
        if (isTimerRunning) {
            startTimeRef.current = performance.now();
            const updateTimer = () => {
                if (isTimerRunning) {
                    const elapsed = performance.now() - startTimeRef.current;
                    setTimer(elapsed);
                    timerRef.current = requestAnimationFrame(updateTimer);
                }
            };
            timerRef.current = requestAnimationFrame(updateTimer);
        } else {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
            }
        };
    }, [isTimerRunning]);

    // Reset timer when algorithm changes
    useEffect(() => {
        setTimer(0);
        startTimeRef.current = 0;
        setIsTimerRunning(false);
    }, [selectedAlgorithm]);

    // Generate a new maze
    const handleGenerate = () => {
        setGrid(generateMaze(ROWS, COLS, 50));
        setVisited([]);
        setPath([]);
        setPlayer({ row: 0, col: 0 });
        setIsSolving(false);
        setTimer(0);
        startTimeRef.current = 0;
        setIsTimerRunning(false);
        setPerformanceRecords([]); // Clear performance records for new maze
    };

    // Animate the pathfinding steps
    const animateSteps = (visitedSteps: Step[], pathSteps: Step[]) => {
        setIsSolving(true);
        setVisited([]);
        setPath([]);
        setTimer(0);
        startTimeRef.current = 0;
        setIsTimerRunning(true);

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
                setIsTimerRunning(false);

                // Calculate elapsed time directly
                const elapsedTime = performance.now() - startTimeRef.current;

                // Record performance immediately with calculated time
                const record: PerformanceRecord = {
                    algorithm: selectedAlgorithm,
                    time: elapsedTime,
                    visitedCount: visitedSteps.length,
                    pathLength: pathSteps.length,
                    timestamp: new Date()
                };
                setPerformanceRecords(prev => [...prev, record]);
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
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Format timer display
    const formatTime = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
    };

    // Get sorted performance records
    const sortedRecords = [...performanceRecords].sort((a, b) => a.time - b.time);

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

                <div className="performance-section">
                    <h2 className="section-title">Performance</h2>
                    <div className="timer-display">
                        <span className="timer-label">Current Time:</span>
                        <span className="timer-value">{formatTime(timer)}</span>
                    </div>

                    {performanceRecords.length > 0 && (
                        <div className="rankings">
                            <h3 className="rankings-title">Algorithm Rankings</h3>
                            <div className="rankings-list">
                                {sortedRecords.map((record, index) => (
                                    <div key={`${record.algorithm}-${record.timestamp.getTime()}`} className="ranking-item">
                                        <div className="ranking-position">#{index + 1}</div>
                                        <div className="ranking-details">
                                            <div className="ranking-algorithm">{record.algorithm}</div>
                                            <div className="ranking-stats">
                                                <span className="ranking-time">{formatTime(record.time)}</span>
                                                <span className="ranking-visits">({record.visitedCount} visited)</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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