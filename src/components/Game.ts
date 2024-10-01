import { PokemonAPI } from "../api/PokemonAPI";
import { Card } from "./Card";

export class Game {
    private _cards: Card[]
    private _firstCard: Card | null = null;
    private _secondCard: Card | null = null;
    private _cardFlipHandlers : Map<Card, (event: Event) => void> = new Map();
    private _lockBoard: boolean = false;
    private _gameContainerElement: HTMLElement;
    private _pairCount: number;

    constructor(gameContainerElement: HTMLElement, pairCount: number) {
        this._cards = []
        this._gameContainerElement = gameContainerElement;
        this._pairCount = pairCount;
    }

    async initializeGame() {
        const pokemonIds = this.generatePokemonIds();

        for(let id of pokemonIds) {
            const imageUrl = PokemonAPI.getRandomPokemon();
            this._cards.push(new Card(id, imageUrl));
            this._cards.push(new Card(id, imageUrl));
        }

        this.shuffleCards();
        this.renderCards();
    }

    private generatePokemonIds() {
        const ids: Array<number> = [];

        while(ids.length < this._pairCount) {
            const id = Math.floor(Math.random() * PokemonAPI.TOTAL_POKEMON) + 1;
            if(!ids.includes(id)) {
                ids.push(id);
            }
        }
        return ids;
    }

    private shuffleCards() {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
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
        if(this._lockBoard) return;
        if(card === this._firstCard) return;

        card.reveal();

        if(!this._firstCard) {
            this._firstCard = card;
            return;
        }

        this._secondCard = card;
        this.checkCardsMatch();
    }


    private checkCardsMatch() {
        if(this._firstCard?.element.dataset.id === this._secondCard?.element.dataset.id) {
            this.disableCards();
            return;
        }
        this.unflipCards();
    }

    private disableCards() {
        if(this._firstCard && this._secondCard) {
            this.removeCardEventListener(this._firstCard);
            this.removeCardEventListener(this._secondCard);
        }

        this.resetBoard();
    }

    private unflipCards() {
        this._lockBoard = true;
        setTimeout(() => {
            this._firstCard!.hide();
            this._secondCard!.hide();

            this.resetBoard();
        }, 1000);
    }

    private resetBoard() {
        this._firstCard = null;
        this._secondCard = null;
        this._lockBoard = false;
    }
}