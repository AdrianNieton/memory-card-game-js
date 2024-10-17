export class EndGameMenu {
    private _element: HTMLElement | null = null;
    private _isVisible: boolean = false;

    constructor(onRestart: () => void, onMainMenu: () => void) {
        this._element = document.createElement('div');
        this._element.className = 'end-game-menu';
        this._element.dataset.id = 'end-menu'
        this._element.style.display = 'none';

        const restartButton = document.createElement('button');
        restartButton.textContent = 'Play Again';
        restartButton.addEventListener('click', onRestart);

        const mainMenuButton = document.createElement('button');
        mainMenuButton.textContent = 'Menu';
        mainMenuButton.addEventListener('click', onMainMenu);

        this._element.appendChild(restartButton);
        this._element.appendChild(mainMenuButton);

        document.body.appendChild(this._element);
    }

    clearMenu() {
        if(this._element) {
            document.body.removeChild(this._element);
        }
        this._element!.innerHTML = '';
        this._element = null;
    }

    show() {
        this._isVisible = true;
        this._element!.style.display = 'flex';
    }

    hide() {
        this._isVisible = false;
        this._element!.style.display = 'none';
    }

    changeVisibility() {
        this._isVisible ? this.hide() : this.show();
    }
}