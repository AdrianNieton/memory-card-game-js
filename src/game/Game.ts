import { Card } from "../components/Card";
import { EndGameMenu } from "../components/menu/EndGameMenu";
import { DEFAULT_PAIR_COUNT, GameConfig, GameMode } from "../components/menu/GameMode";
import { ScoreBoard } from "../components/ScoreBoard";
import { BoardState } from "./BoardState";
import { CardGenerator } from "./CardGenerator";
import { BaseGameMode } from "./modes/BaseGameMode";
import { NormalModeStrategy } from "./modes/NormalModeStrategy";

export class Game {
    private _cards: Card[]
    private readonly _boardState: BoardState;
    private readonly _scoreBoard: ScoreBoard;
    private readonly _cardFlipHandlers : Map<Card, (event: Event) => void> = new Map();
    private readonly _gameContainerElement: HTMLElement;
    private readonly _pairCount: number;
    private _configMode!: GameMode;
    private _mode!: BaseGameMode;
    private _endGameMenu: EndGameMenu;
    private _isVisible: boolean = true;
    private _mainMenuCallback: () => void;

    constructor(gameContainerElement: HTMLElement, config: GameConfig, mainMenuCallback: () => void) {
        this._gameContainerElement = gameContainerElement;
        this._cards = []
        this._boardState = new BoardState();
        this._scoreBoard = new ScoreBoard();
        this._pairCount = config.pairCount || DEFAULT_PAIR_COUNT;
        this._configMode = config.mode;

        this.changeVisibility();
        this._scoreBoard.changeVisibility();
        this._mainMenuCallback = mainMenuCallback;

        this._endGameMenu = new EndGameMenu(
            () => this.restartGame(),
            () => this.returnToMainMenu()
        );
    }

    private createGameMode(mode: GameMode): BaseGameMode {
        let gameMode;
        switch(mode) {
            case GameMode.Normal:
                gameMode = new NormalModeStrategy(
                    this._cards,
                    this._boardState, 
                    this._scoreBoard,
                    this._endGameMenu
                );
                break;
            case GameMode.Timed:
            case GameMode.Hardcore:
            case GameMode.Endless:
        }
        return gameMode!;
    }

    async initializeGame(config: GameConfig) {
        this.clearBoard();
        this._cards.push(...await CardGenerator.generateCards(this._pairCount));
        this._mode = this.createGameMode(config.mode);
        this._mode.setDisableCardsCallback(() => this.disableCards());
        this._endGameMenu.hide();
        this.renderCards();
        this._scoreBoard.resetScore();
        this._boardState.reset();
    }

    private renderCards() {
        this._gameContainerElement.innerHTML = '';
        this._cards.forEach(card => {
            this._gameContainerElement.appendChild(card.element);
            this.addEventListeners(card)
        });
    }

    private addEventListeners(card: Card) {
        const handler = () => this._mode.flipCard(card);
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

    private disableCards() {
        if(this._boardState.firstCard && this._boardState.secondCard) {
            this.removeCardEventListener(this._boardState.firstCard);
            this.removeCardEventListener(this._boardState.secondCard);
        }

        this._boardState.reset();
    }

    private async restartGame() {
        this.clearBoard();
        await this.initializeGame({ mode: this._configMode, pairCount: this._pairCount });
        this._endGameMenu.hide();
        this.show();
    }

    private returnToMainMenu() {
        this.clearBoard();
        this.hide();
        this._mainMenuCallback();
        this._scoreBoard.changeVisibility();
        this._scoreBoard.deleteScoreComponent();
        this._endGameMenu.clearMenu();
    }

    private clearBoard() {
        this._gameContainerElement.innerHTML = '';
        this._cards = [];
        this._boardState.reset();
        this._boardState.resetMatchedPairs();
        this._scoreBoard.resetScore();
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