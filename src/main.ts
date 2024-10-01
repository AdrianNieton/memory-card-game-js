import { Game } from "./components/Game";

function main() {
  const gameContainer = document.getElementById('game-container');
  if(gameContainer) {
    const game = new Game(gameContainer, 10);
    game.initializeGame();
  }
}

// Ejecutar la función principal cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', main);
// https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonIndex}.png