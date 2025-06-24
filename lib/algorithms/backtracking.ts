import { Cell, Coord, Step } from '../../types/types';

// Recursive Backtracking for maze pathfinding
// Returns { visited: Step[], path: Step[] }
export function backtracking(grid: Cell[][], start: Coord, end: Coord): { visited: Step[]; path: Step[] } {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const visitedSteps: Step[] = [];
    const path: Step[] = [];
    let found = false;

    function dfs(row: number, col: number): boolean {
        if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
        if (visited[row][col]) return false;
        if (grid[row][col].bomb) return false; // skip bomb cells
        visited[row][col] = true;
        visitedSteps.push({ coord: { row, col }, isPath: false });
        if (row === end.row && col === end.col) {
            path.push({ coord: { row, col }, isPath: true });
            found = true;
            return true;
        }
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
            if (!cell.walls[wall as keyof typeof cell.walls]) {
                if (dfs(nRow, nCol)) {
                    path.push({ coord: { row, col }, isPath: true });
                    return true;
                }
            }
        }
        return false;
    }

    dfs(start.row, start.col);
    path.reverse();
    return { visited: visitedSteps, path };
} 