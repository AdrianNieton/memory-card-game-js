export class ScoreBoard {
    private _element: HTMLElement;
    private _score: number;

    constructor() {
        this._score = 0;
        this._element = this.createElement();
        const scoreContainer = document.getElementById('score-container');
        scoreContainer?.appendChild(this._element);
    }

    private createElement(): HTMLElement {
        const element = document.createElement('div');
        element.className = 'score-board';
        element.dataset.id = 'score';
        element.innerHTML = `
            <div class="score">
                <p><b>Score: </b><span id="score-value">${this._score}</span></p>
            </div>
        `;
        return element;
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

    updateScore(): void {
        const scoreElement = this._element.querySelector('#score-value');
        if(scoreElement) {
            scoreElement.textContent = this._score.toString();
        }
    }
}