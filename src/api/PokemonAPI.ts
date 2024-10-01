
export class PokemonAPI {
    private static readonly API_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"
    static readonly TOTAL_POKEMON = 1000;

    static getRandomPokemon(): string {
        const id = Math.floor(Math.random() * this.TOTAL_POKEMON) + 1; //There is no pokemon with id = 0
        return `${this.API_BASE_URL}${id}.png`;
    }
}