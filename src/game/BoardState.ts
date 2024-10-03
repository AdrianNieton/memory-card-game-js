import { Card } from "../components/Card";

export class BoardState {
    private _firstCard: Card | null = null;
    private _secondCard: Card | null = null;
    private _lockBoard: boolean = false;
    private _matchedPairs: number = 0;

    get firstCard(): Card | null {
        return this._firstCard;
    }

    get secondCard(): Card | null {
        return this._secondCard;
    }
    
    get isLocked(): boolean {
        return this._lockBoard;
    }

    get matchedPairs(): number {
        return this._matchedPairs;
    }

    setFirstCard(card: Card) {
        this._firstCard = card;
    }

    setSecondCard(card: Card) {
        this._secondCard = card;
    }

    changeLockBoard(): void {
        this._lockBoard = !this._lockBoard;
    }

    reset() {
        this._firstCard = null;
        this._secondCard = null;
        this._lockBoard = false;
    }

    incrementMatchedPairs(): void {
        this._matchedPairs++;
    }

    isPair(): boolean {
        return this._firstCard?.element.dataset.id === this._secondCard?.element.dataset.id;
    }
}