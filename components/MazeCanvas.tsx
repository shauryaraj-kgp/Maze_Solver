import React, { useRef, useEffect } from 'react';
import { Cell, Coord, Step } from '../types/types';

interface MazeCanvasProps {
    grid: Cell[][];
    visited: Step[];
    path: Step[];
    showVisited: boolean;
    showPath: boolean;
    player?: Coord;
    cellSize?: number;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({
    grid,
    visited,
    path,
    showVisited,
    showPath,
    player,
    cellSize = 32,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rows = grid.length;
    const cols = grid[0].length;
    const width = cols * cellSize;
    const height = rows * cellSize;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        // Fill background
        ctx.save();
        ctx.fillStyle = '#0a1124'; // deep blue
        ctx.fillRect(0, 0, width, height);
        ctx.restore();

        // Draw visited cells
        if (showVisited) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            for (const step of visited) {
                ctx.fillStyle = '#1e2a5a'; // deep blue for visited
                ctx.shadowColor = '#00eaff44';
                ctx.shadowBlur = 8;
                ctx.fillRect(step.coord.col * cellSize, step.coord.row * cellSize, cellSize, cellSize);
            }
            ctx.restore();
        }

        // Draw path
        if (showPath) {
            ctx.save();
            ctx.strokeStyle = '#00eaff'; // neon blue
            ctx.shadowColor = '#00eaff';
            ctx.shadowBlur = 16;
            ctx.lineWidth = cellSize / 3;
            ctx.beginPath();
            let started = false;
            for (const step of path) {
                const x = step.coord.col * cellSize + cellSize / 2;
                const y = step.coord.row * cellSize + cellSize / 2;
                if (!started) {
                    ctx.moveTo(x, y);
                    started = true;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
            ctx.restore();
        }

        // Draw maze walls
        ctx.save();
        ctx.strokeStyle = '#7ecfff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00eaff';
        ctx.shadowBlur = 8;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = grid[row][col];
                const x = col * cellSize;
                const y = row * cellSize;
                if (cell.walls.top) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + cellSize, y);
                    ctx.stroke();
                }
                if (cell.walls.right) {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y);
                    ctx.lineTo(x + cellSize, y + cellSize);
                    ctx.stroke();
                }
                if (cell.walls.bottom) {
                    ctx.beginPath();
                    ctx.moveTo(x + cellSize, y + cellSize);
                    ctx.lineTo(x, y + cellSize);
                    ctx.stroke();
                }
                if (cell.walls.left) {
                    ctx.beginPath();
                    ctx.moveTo(x, y + cellSize);
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
        ctx.restore();

        // Draw start (green) and goal (red)
        ctx.save();
        // Start
        ctx.fillStyle = '#00ffb3'; // neon green
        ctx.shadowColor = '#00ffb3';
        ctx.shadowBlur = 16;
        ctx.fillRect(4, 4, cellSize - 8, cellSize - 8);
        // Goal
        ctx.fillStyle = '#ff3b6b'; // neon pink/red
        ctx.shadowColor = '#ff3b6b';
        ctx.shadowBlur = 16;
        ctx.fillRect(
            (cols - 1) * cellSize + 4,
            (rows - 1) * cellSize + 4,
            cellSize - 8,
            cellSize - 8
        );
        ctx.restore();

        // Draw player (optional)
        if (player) {
            ctx.save();
            ctx.fillStyle = '#00eaff'; // neon blue
            ctx.shadowColor = '#00eaff';
            ctx.shadowBlur = 24;
            ctx.beginPath();
            ctx.arc(
                player.col * cellSize + cellSize / 2,
                player.row * cellSize + cellSize / 2,
                cellSize / 3,
                0,
                2 * Math.PI
            );
            ctx.fill();
            ctx.restore();
        }
    }, [grid, visited, path, showVisited, showPath, player, cellSize, rows, cols, width, height]);

    return (
        <>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="maze-canvas"
            />
            <style jsx>{`
                .maze-canvas {
                    border: 3px solid #00eaff;
                    border-radius: 20px;
                    background: #0a1124;
                    display: block;
                    margin: 0 auto;
                    box-shadow: 0 0 40px #00eaff44, 0 8px 40px #0a1836cc;
                    transition: box-shadow 0.2s;
                }
                .maze-canvas:focus {
                    outline: none;
                    box-shadow: 0 0 60px #00eaffcc, 0 8px 40px #0a1836cc;
                }
            `}</style>
        </>
    );
};

export default MazeCanvas; 