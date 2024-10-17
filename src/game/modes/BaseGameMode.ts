import { Card } from "../../components/Card";
import { EndGameMenu } from "../../components/menu/EndGameMenu";
import { ScoreBoard } from "../../components/ScoreBoard";
import { BoardState } from "../BoardState";

export abstract class BaseGameMode {
    protected _cards: Card[] = [];
    protected _pairCount: number = 0;
    protected _isVisible: boolean = true;
    protected _boardState: BoardState;
    protected _scoreBoard: ScoreBoard;
    protected _endGameMenu: EndGameMenu;

    constructor(cards: Card[], boardState: BoardState, scoreBoard: ScoreBoard, endGameMenu: EndGameMenu) {
        this._cards = cards
        this._boardState = boardState;
        this._scoreBoard = scoreBoard;
        this._pairCount = this._cards.length / 2;
        this._endGameMenu = endGameMenu;
    }

    protected showEndGameMenu() { this._endGameMenu.show(); }

    private disableCardsCallback: (() => void) | null = null;
    setDisableCardsCallback(callback: () => void) { this.disableCardsCallback = callback; }

    flipCard(card: Card) {
        if(card === this._boardState.firstCard || this._boardState.isLocked) return;

        card.flip();

        if(!this._boardState.firstCard) {
            this._boardState.setFirstCard(card);
            return;
        }

        this._boardState.setSecondCard(card);
        this.checkCardsMatch();
    }

    private checkCardsMatch() {
        if(this._boardState.isPair()) {
           this.handleMatchedCards();
        } else {
            this.handleUnmatchedCards();
        }
    }

    private handleMatchedCards(): void {
        if(this.disableCardsCallback) {
            this.disableCardsCallback();
        }
        this._boardState.incrementMatchedPairs();
        this._scoreBoard.incrementScore();
        if(this._boardState.matchedPairs === this._pairCount) {
            this.onGameCompleted();
        }
    }

    private handleUnmatchedCards(): void {
        this._boardState.changeLockBoard();
        setTimeout(() => {
            this._boardState.firstCard!.flip();
            this._boardState.secondCard!.flip();

            this._boardState.reset();
        }, 1000);
    }

    abstract onGameCompleted(): void;
}