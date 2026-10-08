import handleCartAction from './UseHandleCartAction';
import * as Alertify from '@constants/mocks/useAlert-data';
import {state, availableLastUpdateAction} from '@js/state';
import EVENTS from '@constants/events-map';
import {formDataGet, resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('handleCartAction', () => {
  beforeEach(() => {
    setupThemeWindow();
    document.body.innerHTML = Alertify.NotificationsContainer;
    window.prestashop.emit = jest.fn();
    global.fetch = jest.fn().mockResolvedValue({} as Response);
  });

  it('shows delete alert and records action', async () => {
    document.body.innerHTML = `
      ${Alertify.NotificationsContainer}
      <div class="js-cart-update-alert" data-ps-data="was removed" data-ps-data-close="Close"></div>
      <a href="/cart?delete=1"
        data-link-action="delete-from-cart"
        data-product-url="/p/1"
        data-product-name="Shirt">del</a>
    `;
    const link = document.querySelector('a') as HTMLAnchorElement;
    const event = new MouseEvent('click', {bubbles: true, cancelable: true});
    Object.defineProperty(event, 'target', {value: link});
    handleCartAction(event);
    await Promise.resolve();

    expect(state.get('lastUpdateAction')).toBe(availableLastUpdateAction.DELETE_FROM_CART);
    const alertLink = document.querySelector('.alert-link') as HTMLAnchorElement;
    expect(alertLink.href).toContain('/p/1');
    expect(alertLink.textContent).toBe('Shirt');
    const body = (fetch as jest.Mock).mock.calls[0][1].body as FormData;
    expect(formDataGet(body, 'ajax')).toBe('1');
    expect(formDataGet(body, 'action')).toBe('update');
  });

  it('does not fetch when href is missing', () => {
    const link = document.createElement('a');
    link.setAttribute('data-link-action', 'delete-from-cart');
    const event = new MouseEvent('click', {bubbles: true, cancelable: true});
    Object.defineProperty(event, 'target', {value: link});
    handleCartAction(event);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('emits updateCart without delete action for other links', async () => {
    const link = document.createElement('a');
    link.href = '/cart?update=1';
    const event = new MouseEvent('click', {bubbles: true, cancelable: true});
    Object.defineProperty(event, 'target', {value: link});
    handleCartAction(event);
    await Promise.resolve();
    expect(window.prestashop.emit).toHaveBeenCalledWith(EVENTS.updateCart, expect.any(Object));
    expect(state.get('lastUpdateAction')).toBeNull();
  });
});
