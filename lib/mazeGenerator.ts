import { Cell } from '../types/types';

// Directions for moving in the grid
const directions = [
    { row: -1, col: 0, wall: 'top', opposite: 'bottom' },
    { row: 0, col: 1, wall: 'right', opposite: 'left' },
    { row: 1, col: 0, wall: 'bottom', opposite: 'top' },
    { row: 0, col: -1, wall: 'left', opposite: 'right' },
];

type Wall = 'top' | 'right' | 'bottom' | 'left';

function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generateMaze(rows: number, cols: number, extraPaths: number = 0): Cell[][] {
    // Initialize grid
    const grid: Cell[][] = Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            row,
            col,
            walls: { top: true, right: true, bottom: true, left: true },
            visited: false,
        }))
    );

    function carve(row: number, col: number) {
        grid[row][col].visited = true;
        const dirs = shuffle([...directions]);
        for (const dir of dirs) {
            const nRow = row + dir.row;
            const nCol = col + dir.col;
            if (
                nRow >= 0 && nRow < rows &&
                nCol >= 0 && nCol < cols &&
                !grid[nRow][nCol].visited
            ) {
                grid[row][col].walls[dir.wall as Wall] = false;
                grid[nRow][nCol].walls[dir.opposite as Wall] = false;
                carve(nRow, nCol);
            }
        }
    }

    carve(0, 0);
    // Reset visited for pathfinding
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[r][c].visited = false;

    // Add extra paths by removing random walls between adjacent cells
    let attempts = 0;
    let added = 0;
    while (added < extraPaths && attempts < extraPaths * 10) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const nRow = row + dir.row;
        const nCol = col + dir.col;
        if (
            nRow >= 0 && nRow < rows &&
            nCol >= 0 && nCol < cols &&
            grid[row][col].walls[dir.wall as Wall] &&
            grid[nRow][nCol].walls[dir.opposite as Wall]
        ) {
            grid[row][col].walls[dir.wall as Wall] = false;
            grid[nRow][nCol].walls[dir.opposite as Wall] = false;
            added++;
        }
        attempts++;
    }

    return grid;
} 