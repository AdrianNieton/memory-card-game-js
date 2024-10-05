export enum GameMode {
    Normal = "normal",
    Timed = "timed",
    Hardcore = "hardcore",
    Endless = "endless"
}

export interface GameConfig {
    mode: GameMode;
    pairCount?: number;
}

export const DEFAULT_PAIR_COUNT = 20;