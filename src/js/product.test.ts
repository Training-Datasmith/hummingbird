import initProductBehavior from './product';
import EVENTS from '@constants/events-map';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initProductBehavior quantity', () => {
  beforeEach(() => {
    setupThemeWindow();
    window.prestashop.emit = jest.fn();
    jest.useFakeTimers();
  });

  it('clamps blur value to minimum and emits updateProduct', () => {
    document.body.innerHTML = `
      <input class="js-quantity-wanted" min="2" value="1" />
      <button class="js-increment-button"></button>
      <button class="js-decrement-button"></button>
    `;
    initProductBehavior();
    const input = document.querySelector('.js-quantity-wanted') as HTMLInputElement;
    input.value = '1';
    input.dispatchEvent(new Event('blur'));
    expect(input.value).toBe('2');
    expect(window.prestashop.emit).toHaveBeenCalledWith(EVENTS.updateProduct, expect.objectContaining({
      eventType: 'updatedProductQuantity',
    }));
  });

  it('debounces input events before emitting', () => {
    document.body.innerHTML = `
      <input class="js-quantity-wanted" min="1" value="1" />
      <button class="js-increment-button"></button>
      <button class="js-decrement-button"></button>
    `;
    initProductBehavior();
    const input = document.querySelector('.js-quantity-wanted') as HTMLInputElement;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('input'));
    jest.advanceTimersByTime(500);
    expect(window.prestashop.emit).toHaveBeenCalledTimes(1);
  });
});
