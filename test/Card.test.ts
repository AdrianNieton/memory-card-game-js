import { beforeEach, describe, expect, test } from '@jest/globals';
import { Card } from '../src/components/Card'


describe('Card', () => {

    let card: Card;
    beforeEach(() => {
        card = new Card(1, "https://example.com/pokemon.png");
        document.body.innerHTML = '';
        document.body.appendChild(card.element);
    });

    test('Should create a card element with id 1', () => {
        expect(card.element).toBeDefined();
        expect(card.element.className).toBe("card");
        expect(card.element.dataset.id).toBe("1");
    });

    test('Should have correct structure', () => {
        expect(card.element.querySelector('.card-inner')).toBeTruthy();
        expect(card.element.querySelector('.card-front img')).toBeTruthy();
        expect(card.element.querySelector('.card-back img')).toBeTruthy();
    });

    test('Should set correct image URLs', () => {
        const frontImg = card.element.querySelector('.card-front img') as HTMLImageElement;
        const backImg = card.element.querySelector('.card-back img') as HTMLImageElement;
        expect(frontImg.src).toContain('/reverse-card.png');
        expect(backImg.src).toContain('pokemon.png');
    });

    test('Should reveal card', () => {
        card.reveal();
        expect(card.isRevealed).toBe(true);
        expect(card.element.classList.contains('flipped')).toBe(true);
    });

    test('Should hide card', () => {
        card.reveal();
        card.hide();
        expect(card.isRevealed).toBe(false);
        expect(card.element.classList.contains('flipped')).toBe(false);
    });
});