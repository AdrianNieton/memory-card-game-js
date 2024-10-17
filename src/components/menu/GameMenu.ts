import { PokemonAPI } from "../../api/PokemonAPI";
import { DEFAULT_PAIR_COUNT, GameConfig, GameMode } from "./GameMode";

export class GameMenu {
    private _element: HTMLElement;
    private _onGameStart: (config: GameConfig) => void;
    private _isVisible: boolean = true;
    private _sliderContainer: HTMLElement | null = null;
    private _slider: HTMLInputElement | null = null;
    private _sliderValue: HTMLSpanElement | null = null;
    private _startButton: HTMLButtonElement | null = null;
    private _selectedMode: GameMode | null = null;

    constructor(onGameStart: (config: GameConfig) => void) {
        this._onGameStart = onGameStart;
        this._element = this.createElement();
        const menuContainer = document.getElementById('menu-container');
        menuContainer?.appendChild(this._element);
    }

    private createElement(): HTMLElement {
        const element = document.createElement('div');
        element.className = 'main-menu';
        element.dataset.id = 'main-menu';

        const title = document.createElement('h1');
        title.textContent = "Pokémon Memory Game";
        element.appendChild(title);
        
        const subTitle = document.createElement('h2');
        subTitle.textContent = "Select Game Mode";
        element.appendChild(subTitle);

        const modeList = document.createElement('ul');
        modeList.className = 'mode-list';

        Object.entries(GameMode).forEach(([_, mode]) => {
            const modeItem = document.createElement('li');
            const modeButton = document.createElement('button');
            modeButton.textContent = this.capitalizeFirstLetter(mode);
            modeButton.addEventListener('click', () => {
                this.handleModeSelect(mode as GameMode);
                this.updateSelectedButton(modeButton);
            });

            modeItem.appendChild(modeButton);
            modeList.appendChild(modeItem);

            if (mode === GameMode.Normal) {
                this._sliderContainer = this.createSlider();
                modeList.appendChild(this._sliderContainer);
            }
        });

        element.appendChild(modeList);

        this._startButton = document.createElement('button');
        this._startButton.className = '';
        this._startButton.textContent = 'Start Game';
        this._startButton.style.display = 'none';
        this._startButton.addEventListener('click', () => this.startGame());
        element.appendChild(this._startButton);

        return element;
    }

    private updateSelectedButton(selectedButton: HTMLButtonElement) {
        const buttons = document.querySelectorAll('.mode-list button');
        buttons.forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected'); 
    }

    private createSlider(): HTMLElement {
        const container = document.createElement('div');
        container.className = 'slider-container';
        container.style.display = 'none';

        const label = document.createElement('label');
        label.textContent = 'Number of pairs: ';
        container.appendChild(label);

        this._slider = document.createElement('input');
        this._slider.type = 'range';
        this._slider.min = '5';
        this._slider.max = PokemonAPI.TOTAL_POKEMON.toString();
        this._slider.value = DEFAULT_PAIR_COUNT.toString();
        this._slider.classList.add('pokemon-slider');
        container.appendChild(this._slider);

        this._sliderValue = document.createElement('span');
        this._sliderValue.textContent = this._slider.value;
        this._sliderValue.classList.add('slider-value');
        container.appendChild(this._sliderValue);

        this._slider.addEventListener('input', this.updateSliderThumb.bind(this));

        this.updateSliderThumb();

        return container;
    }

    private updateSliderThumb() {
        if (!this._slider) return;

        const value = parseInt(this._slider.value);
        const max = parseInt(this._slider.max);
        const percentage = (value / max) * 100;
        const pokemonClasses = [..."pichu", "pikachu", "raichu", "mewtwo"];
        this._slider.classList.remove(...pokemonClasses);

        if (percentage < 25) {
            this._slider.classList.add('pichu');
        } else if (percentage <= 50) {
            this._slider.classList.add('pikachu');
        } else if (percentage <= 75) {
            this._slider.classList.add('raichu');
        } else {
            this._slider.classList.add('mewtwo');
        }

        if (this._sliderValue) {
            this._sliderValue.textContent = this._slider.value;
        }
    }

    private handleModeSelect(mode: GameMode): void {
        this._selectedMode = mode;
        this._startButton!.style.display = 'block';

        if (mode === GameMode.Normal) {
            this._sliderContainer!.style.display = 'block';
        } else {
            this._sliderContainer!.style.display = 'none';
        }
    }

    private startGame(): void {
        if (!this._selectedMode) return;

        const pairCount = (this._selectedMode === GameMode.Normal || this._selectedMode === GameMode.Timed) 
            ? parseInt(this._slider!.value, 10) 
            : DEFAULT_PAIR_COUNT;
        this._onGameStart({ mode: this._selectedMode, pairCount });
    }

    changeVisibility(): void {
        this._isVisible = !this._isVisible;
        this._element.style.display = this._isVisible ? 'flex' : 'none';
    }

    private capitalizeFirstLetter(string: string): string {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}