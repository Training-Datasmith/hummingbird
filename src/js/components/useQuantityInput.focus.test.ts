import '@js/components/useQuantityInput';
import {state, availableLastUpdateAction} from '@js/state';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
  window.fetch = jest.fn();
});

describe('useQuantityInput cart focus delegation', () => {
  beforeAll(() => {
    setupThemeWindow();
    document.dispatchEvent(new Event('DOMContentLoaded'));
  });

  it('records update action and focus on quantity button click', () => {
    document.body.innerHTML = `
      <div class="js-cart-list">
        <div class="js-quantity-button">
          <button id="qty-up" type="button">+</button>
        </div>
      </div>
    `;
    const btn = document.getElementById('qty-up') as HTMLButtonElement;
    btn.focus();
    btn.dispatchEvent(new MouseEvent('click', {bubbles: true}));

    expect(state.get('lastUpdateAction')).toBe(availableLastUpdateAction.UPDATE_PRODUCT_QUANTITY);
    expect(state.get('storedFocusElementId')).toBe('qty-up');
  });

  it('does not record action for clicks outside quantity wrapper', () => {
    document.body.innerHTML = '<button id="other">x</button>';
    document.getElementById('other')?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    expect(state.get('lastUpdateAction')).toBeNull();
  });
});
