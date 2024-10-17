import { Card } from "../../components/Card";
import { EndGameMenu } from "../../components/menu/EndGameMenu";
import { ScoreBoard } from "../../components/ScoreBoard";
import { BoardState } from "../BoardState";
import { BaseGameMode } from "./BaseGameMode";


export class NormalModeStrategy extends BaseGameMode {
    constructor(cards: Card[], boardState: BoardState, scoreBoard: ScoreBoard, endGameMenu: EndGameMenu) {
        super(cards, boardState, scoreBoard, endGameMenu);
    }

    onGameCompleted(): void {
        this.showEndGameMenu();
    }
}