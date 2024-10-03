import { Card } from "../components/Card";
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

    constructor(gameContainerElement: HTMLElement, pairCount: number) {
        this._cards = []
        this._boardState = new BoardState();
        this._scoreBoard = new ScoreBoard();
        this._gameContainerElement = gameContainerElement;
        this._pairCount = pairCount;
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
}