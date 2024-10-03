import { PokemonAPI } from "../api/PokemonAPI";
import { Card } from "../components/Card";

export class CardGenerator {

    static async generateCards(pairCount: number): Promise<Card[]> {
        const pokemonIds = this.generatePokemonIds(pairCount);
        const cards: Card[] = [];

        for(let id of pokemonIds) {
            const imageUrl = PokemonAPI.getRandomPokemon();
            cards.push(new Card(id, imageUrl));
            cards.push(new Card(id, imageUrl));
        }

        return this.shuffleCards(cards);
    }

    private static generatePokemonIds(pairCount: number): number[] {
        const ids: Set<number> = new Set();

        while(ids.size < pairCount) {
            ids.add(Math.floor(Math.random() * PokemonAPI.TOTAL_POKEMON) + 1);
        }
        return Array.from(ids);
    }

    private static shuffleCards(cards: Card[]): Card[] {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return cards;
    }
}