import { Cell, Coord, Step } from '../../types/types';

// Breadth-First Search for maze pathfinding
// Treats all cells as cost 1, regardless of terrain
export function bfs(grid: Cell[][], start: Coord, end: Coord): { visited: Step[]; path: Step[] } {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const prev: (Coord | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    const queue: Coord[] = [start];
    const visitedSteps: Step[] = [];
    visited[start.row][start.col] = true;

    while (queue.length > 0) {
        const { row, col } = queue.shift()!;
        visitedSteps.push({ coord: { row, col }, isPath: false });
        if (row === end.row && col === end.col) break;
        const cell = grid[row][col];
        const directions = [
            { dr: -1, dc: 0, wall: 'top' },
            { dr: 1, dc: 0, wall: 'bottom' },
            { dr: 0, dc: -1, wall: 'left' },
            { dr: 0, dc: 1, wall: 'right' },
        ];
        for (const { dr, dc, wall } of directions) {
            const nRow = row + dr;
            const nCol = col + dc;
            if (
                nRow >= 0 && nRow < rows &&
                nCol >= 0 && nCol < cols &&
                !cell.walls[wall as keyof typeof cell.walls] &&
                !visited[nRow][nCol]
            ) {
                queue.push({ row: nRow, col: nCol });
                visited[nRow][nCol] = true;
                prev[nRow][nCol] = { row, col };
            }
        }
    }

    // Reconstruct path
    const path: Step[] = [];
    let curr: Coord | null = end;
    while (curr && !(curr.row === start.row && curr.col === start.col)) {
        path.push({ coord: curr, isPath: true });
        curr = prev[curr.row][curr.col];
    }
    if (curr) path.push({ coord: curr, isPath: true });
    path.reverse();
    return { visited: visitedSteps, path };
} 