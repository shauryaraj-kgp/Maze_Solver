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
    onCellClick?: (row: number, col: number) => void;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({
    grid,
    visited,
    path,
    showVisited,
    showPath,
    player,
    cellSize = 32,
    onCellClick,
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

        // Draw terrain overlays
        ctx.save();
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = grid[row][col];
                if (cell.terrain && cell.terrain !== 'normal') {
                    if (cell.terrain === 'soil') ctx.fillStyle = 'rgba(139, 69, 19, 0.45)'; // brown
                    else if (cell.terrain === 'water') ctx.fillStyle = 'rgba(30, 144, 255, 0.45)'; // blue
                    else if (cell.terrain === 'river') ctx.fillStyle = 'rgba(0, 255, 255, 0.45)'; // cyan
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
        ctx.restore();

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

    // Handle cell click
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onCellClick) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            onCellClick(row, col);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="maze-canvas"
            onClick={handleCanvasClick}
        />
    );
};

export default MazeCanvas; 