export class Card {
    private _element: HTMLElement;
    private _imageUrl: string;
    private _isRevealed: boolean = false;

    constructor(id: number, imageUrl: string) {
        this._imageUrl = imageUrl;
        this._element = this.createElement(id);
    }

    private createElement(id: number): HTMLElement {
        const element = document.createElement('div');
        element.className = 'card';
        element.dataset.id = id.toString();
        element.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="/reverse-card.png" alt="card reverse">
                </div>
                <div class="card-back">
                    <img src="${this._imageUrl}" alt="Pokemon">
                </div>
            </div>
        `;

        return element;
    }

    get element(): HTMLElement {
        return this._element;
    }

    get isRevealed(): boolean {
        return this._isRevealed;
    }

    reveal(): void {
        if(!this._isRevealed) {
            this._isRevealed = true;
            this._element.classList.add('flipped');
        }
    }

    hide(): void {
        if(this._isRevealed) {
            this._isRevealed = false;
            this._element.classList.remove('flipped');
        }
    }

    flip(): void {
        this._isRevealed ? this.hide() : this.reveal();
    }
}