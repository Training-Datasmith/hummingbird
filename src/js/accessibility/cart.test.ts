import initCartAccessibility from './cart';
import {state, availableLastUpdateAction} from '@js/state';
import EVENTS from '@constants/events-map';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initCartAccessibility', () => {
  beforeAll(() => {
    setupThemeWindow();
    initCartAccessibility();
  });

  it('focuses announced delete alert and clears action', () => {
    document.body.innerHTML = `
      <div class="js-cart-update-alert">
        <div data-ps-action="to-be-announced" tabindex="-1"></div>
      </div>
    `;
    state.set('lastUpdateAction', availableLastUpdateAction.DELETE_FROM_CART);
    const alertChild = document.querySelector('[data-ps-action="to-be-announced"]') as HTMLElement;
    window.prestashop.emit(EVENTS.updatedCart);
    expect(alertChild.getAttribute('data-ps-action')).toBeNull();
    expect(document.activeElement).toBe(alertChild);
    expect(state.get('lastUpdateAction')).toBeNull();
  });
});
