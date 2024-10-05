import { GameMenu } from "./components/menu/GameMenu";
import { GameConfig } from "./components/menu/GameMode";
import { Game } from "./game/Game";

function main() {
  const gameContainer = document.getElementById('game-container');
  if(!gameContainer) {
    console.error("Game container not found");
    return;
  }

  const menu = new GameMenu((config: GameConfig) => {
    menu.changeVisibility();
    const game = new Game(gameContainer, config);
    game.changeVisibility();
    game.initializeGame();
  });

}

// Ejecutar la función principal cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', main);