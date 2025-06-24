import { Cell, Coord, Step } from '../../types/types';

export function dijkstra(
    grid: Cell[][],
    start: Coord,
    end: Coord
): { visited: Step[]; path: Step[] } {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited: Step[] = [];
    const path: Step[] = [];
    const dist: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    const prev: (Coord | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
    const inQueue: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

    const queue: { coord: Coord; dist: number }[] = [];
    dist[start.row][start.col] = 0;
    queue.push({ coord: start, dist: 0 });
    inQueue[start.row][start.col] = true;

    const directions: { dr: number; dc: number; wall: keyof Cell['walls'] }[] = [
        { dr: -1, dc: 0, wall: 'top' },
        { dr: 1, dc: 0, wall: 'bottom' },
        { dr: 0, dc: -1, wall: 'left' },
        { dr: 0, dc: 1, wall: 'right' },
    ];

    while (queue.length > 0) {
        // Find the node with the smallest distance
        queue.sort((a, b) => a.dist - b.dist);
        const { coord } = queue.shift()!;
        const { row, col } = coord;
        inQueue[row][col] = false;
        visited.push({ coord: { row, col }, isPath: false });

        if (row === end.row && col === end.col) break;

        for (const { dr, dc, wall } of directions) {
            const nr = row + dr;
            const nc = col + dc;
            if (
                nr >= 0 && nr < rows &&
                nc >= 0 && nc < cols &&
                !grid[row][col].walls[wall]
            ) {
                const alt = dist[row][col] + 1;
                if (alt < dist[nr][nc]) {
                    dist[nr][nc] = alt;
                    prev[nr][nc] = { row, col };
                    if (!inQueue[nr][nc]) {
                        queue.push({ coord: { row: nr, col: nc }, dist: alt });
                        inQueue[nr][nc] = true;
                    }
                }
            }
        }
    }

    // Reconstruct path
    let curr: Coord | null = end;
    while (curr && prev[curr.row][curr.col]) {
        path.unshift({ coord: curr, isPath: true });
        curr = prev[curr.row][curr.col];
    }
    if (curr && curr.row === start.row && curr.col === start.col) {
        path.unshift({ coord: curr, isPath: true });
    }

    return { visited, path };
} 