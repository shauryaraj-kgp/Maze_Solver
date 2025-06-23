import { Cell, Coord, Step } from '../../types/types';

function manhattan(a: Coord, b: Coord): number {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

// A* Search for maze pathfinding
// Returns { visited: Step[], path: Step[] }
export function aStar(grid: Cell[][], start: Coord, end: Coord): { visited: Step[]; path: Step[] } {
    const rows = grid.length;
    const cols = grid[0].length;
    const open: Coord[] = [start];
    const cameFrom: (Coord | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    const gScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const fScore: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
    const visitedSteps: Step[] = [];
    gScore[start.row][start.col] = 0;
    fScore[start.row][start.col] = manhattan(start, end);

    while (open.length > 0) {
        // Find node in open with lowest fScore
        let minIdx = 0;
        for (let i = 1; i < open.length; i++) {
            const { row, col } = open[i];
            if (fScore[row][col] < fScore[open[minIdx].row][open[minIdx].col]) minIdx = i;
        }
        const current = open.splice(minIdx, 1)[0];
        const { row, col } = current;
        visitedSteps.push({ coord: { row, col }, isPath: false });
        if (row === end.row && col === end.col) break;
        visited[row][col] = true;
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
                !cell.walls[wall as keyof typeof cell.walls]
            ) {
                const tentativeG = gScore[row][col] + 1;
                if (tentativeG < gScore[nRow][nCol]) {
                    cameFrom[nRow][nCol] = { row, col };
                    gScore[nRow][nCol] = tentativeG;
                    fScore[nRow][nCol] = tentativeG + manhattan({ row: nRow, col: nCol }, end);
                    if (!visited[nRow][nCol] && !open.some(c => c.row === nRow && c.col === nCol)) {
                        open.push({ row: nRow, col: nCol });
                    }
                }
            }
        }
    }

    // Reconstruct path
    const path: Step[] = [];
    let curr: Coord | null = end;
    while (curr && !(curr.row === start.row && curr.col === start.col)) {
        path.push({ coord: curr, isPath: true });
        curr = cameFrom[curr.row][curr.col];
    }
    if (curr) path.push({ coord: curr, isPath: true });
    path.reverse();
    return { visited: visitedSteps, path };
} 