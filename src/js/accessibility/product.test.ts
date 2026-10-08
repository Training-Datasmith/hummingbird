import initProductAccessibility from './product';
import EVENTS from '@constants/events-map';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initProductAccessibility', () => {
  beforeAll(() => {
    setupThemeWindow();
    initProductAccessibility();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('restores focus after updatedProduct in main context', () => {
    document.body.innerHTML = `
      <div data-ps-ref="product-container">
        <button id="color-1"></button>
      </div>
    `;
    const button = document.getElementById('color-1') as HTMLButtonElement;
    window.prestashop.emit(EVENTS.updateProduct, {event: {target: button}});
    window.prestashop.emit(EVENTS.updatedProduct);
    expect(document.activeElement).toBe(button);
  });

  it('sets aria-live on availability after combinationFocusRestored', () => {
    document.body.innerHTML = `
      <div data-ps-ref="product-container">
        <div data-ps-ref="product-availability"></div>
      </div>
    `;
    const availability = document.querySelector('[data-ps-ref="product-availability"]') as HTMLElement;
    window.prestashop.emit(EVENTS.combinationFocusRestored, {context: 'main'});
    jest.advanceTimersByTime(250);
    expect(availability.getAttribute('aria-live')).toBe('polite');
  });
});
