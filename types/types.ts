export type Coord = {
    row: number;
    col: number;
};

export type TerrainType = 'normal' | 'soil' | 'water' | 'river';

export type Cell = {
    row: number;
    col: number;
    walls: {
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    visited: boolean;
    terrain?: TerrainType;
};

export type Step = {
    coord: Coord;
    isPath: boolean;
}; 