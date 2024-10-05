import { DEFAULT_PAIR_COUNT, GameConfig, GameMode } from "./GameMode";


export class GameMenu {
    private _element: HTMLElement;
    private _onGameStart: (config: GameConfig) => void;
    private _isVisible: boolean = true;

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
        title.textContent = "Pokemon Memory Game";
        element.appendChild(title);
        
        const subTitle = document.createElement('h2');
        subTitle.textContent = "Select Game Mode";
        element.appendChild(subTitle);

        const modeList = document.createElement('ul');
        modeList.className = 'mode-list';

        Object.entries(GameMode).forEach(([_, mode]) => {
            const modeItem = document.createElement('li');
            const modeButton = document.createElement('button');
            modeButton.textContent = mode;
            modeButton.addEventListener('click', () => this.handleModeSelect(mode as GameMode));

            modeItem.appendChild(modeButton);
            modeList.appendChild(modeItem);
        });

        element.appendChild(modeList);

        return element;
    }

    private handleModeSelect(mode: GameMode): void {
        if(mode === GameMode.Normal || mode === GameMode.Timed) {
            this.showPairCountPrompt(mode);
        } else {
            this._onGameStart({mode});
        }
    }

    private showPairCountPrompt(mode: GameMode): void {
        const pairCount = prompt(`Enter the number of pairs for ${mode} mode:`, DEFAULT_PAIR_COUNT.toString());
        const parsedPairCount = pairCount ? parseInt(pairCount, 10) : DEFAULT_PAIR_COUNT;
        this._onGameStart({ mode, pairCount: parsedPairCount });
    }

    private hide(): void {
        this._element.style.display = 'None';
    }

    private show(): void {
        this._element.style.display = 'block';
    }

    changeVisibility(): void {
        this._isVisible ? this.hide() : this.show();
    }
}