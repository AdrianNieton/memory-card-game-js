import { Card } from "../components/Card";
import { DEFAULT_PAIR_COUNT, GameConfig, GameMode } from "../components/menu/GameMode";
import { ScoreBoard } from "../components/ScoreBoard";
import { BoardState } from "./BoardState";
import { CardGenerator } from "./CardGenerator";

export class Game {
    private readonly _cards: Card[]
    private readonly _boardState: BoardState;
    private readonly _scoreBoard: ScoreBoard;
    private readonly _cardFlipHandlers : Map<Card, (event: Event) => void> = new Map();
    private readonly _gameContainerElement: HTMLElement;
    private readonly _pairCount: number;
    private _mode: GameMode;
    private _isVisible: boolean = true;

    constructor(gameContainerElement: HTMLElement, config: GameConfig) {
        this._gameContainerElement = gameContainerElement;
        this._mode = config.mode;
        this._cards = []
        this._boardState = new BoardState();
        this._scoreBoard = new ScoreBoard();
        this._pairCount = config.pairCount || DEFAULT_PAIR_COUNT;
        this.changeVisibility();
        this._scoreBoard.changeVisibility();
        console.log(this._mode);
    }

    async initializeGame() {
        this._cards.push(...await CardGenerator.generateCards(this._pairCount));
        this.renderCards();
    }

    private renderCards() {
        this._cards.forEach(card => {
            this._gameContainerElement.appendChild(card.element);
            this.addEventListeners(card)
        });
    }

    private addEventListeners(card: Card) {
        const handler = () => this.flipCard(card);
        this._cardFlipHandlers.set(card, handler);
        card.element.addEventListener('click', handler);
    }

    private removeCardEventListener(card: Card) {
        const handler = this._cardFlipHandlers.get(card);
        if(handler) {
            card.element.removeEventListener('click', handler);
            this._cardFlipHandlers.delete(card);
        }
    }

    private flipCard(card: Card) {
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
        this.disableCards();
        this._boardState.incrementMatchedPairs();
        this._scoreBoard.incrementScore();
        if(this._boardState.matchedPairs === this._pairCount) {
            //Game Completed
        }
    }

    private handleUnmatchedCards(): void {
        this._boardState.changeLockBoard();
        setTimeout(() => {
            this._boardState.firstCard!.flip();
            this._boardState.secondCard!.flip();

            this.resetBoard();
        }, 1000);
    }

    private disableCards() {
        if(this._boardState.firstCard && this._boardState.secondCard) {
            this.removeCardEventListener(this._boardState.firstCard);
            this.removeCardEventListener(this._boardState.secondCard);
        }

        this.resetBoard();
    }

    private resetBoard() {
        this._boardState.reset();
    }

    private hide() {
        if(this._isVisible) {
            this._isVisible = false;
            this._gameContainerElement.style.display = 'None';
        }
    }

    private show() {
        if(!this._isVisible) {
            this._isVisible = true;
            this._gameContainerElement.style.display = 'grid';
        }
    }

    changeVisibility() {
        this._isVisible ? this.hide() : this.show();
    }
}