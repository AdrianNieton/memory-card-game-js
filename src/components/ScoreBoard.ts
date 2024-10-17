export class ScoreBoard {
    private _element: HTMLElement;
    private _score: number;
    private _scoreContainer: HTMLElement | null;
    private _isVisible: boolean = false;

    constructor() {
        this._score = 0;
        this._element = this.createElement();
        this._scoreContainer = document.getElementById('score-container');
        if(this._scoreContainer) {
            this._scoreContainer.appendChild(this._element);
        }
    }

    private createElement(): HTMLElement {
        const scoreWarpper = document.createElement('div');
        scoreWarpper.className = 'score-wrapper';
        scoreWarpper.dataset.id = 'score-wrapper';
        const element = document.createElement('div');
        element.className = 'score-board';
        element.dataset.id = 'score';
        element.innerHTML = `
            <div class="score">
                <p><b>Score: </b><span id="score-value">${this._score}</span></p>
            </div>
        `;

        scoreWarpper.appendChild(element);
        return scoreWarpper;
    }

    get element(): HTMLElement {
        return this._element;
    }

    get score(): number {
        return this._score;
    }

    incrementScore(): void {
        this._score += 20;
        this.updateScore();
    }

    resetScore(): void {
        this._score = 0;
        this.updateScore();
    }

    updateScore(): void {
        const scoreElement = this._element.querySelector('#score-value');
        if(scoreElement) {
            scoreElement.textContent = this._score.toString();
        }
    }

    deleteScoreComponent() { this._scoreContainer!.innerHTML = ''; }

    private hide() {
        if(this._isVisible) {
            this._isVisible = false;
            this._scoreContainer!.style.display = 'None';
        }
    }

    private show() {
        if(!this._isVisible) {
            this._isVisible = true;
            this._scoreContainer!.style.display = 'block';
        }
    }

    changeVisibility() {
        this._isVisible ? this.hide() : this.show();
    }
}