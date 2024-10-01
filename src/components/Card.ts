export class Card {
    private _element: HTMLElement;
    private _imageUrl: string;
    private _isRevealed: boolean = false;

    constructor(id: number, imageUrl: string) {
        this._imageUrl = imageUrl;
        this._element = document.createElement('div');
        this._element.className = 'card';
        this._element.dataset.id = id.toString();
        this._element.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="/reverse-card.png" alt="card reverse">
                </div>
                <div class="card-back">
                    <img src="${this._imageUrl}" alt="Pokemon">
                </div>
            </div>
        `;
    }

    get element(): HTMLElement {
        return this._element;
    }

    get isRevealed(): boolean {
        return this._isRevealed;
    }

    reveal(): void {
        this._isRevealed = true;
        this._element.classList.add('flipped');
    }

    hide(): void {
        this._isRevealed = false;
        this._element.classList.remove('flipped');
    }
}