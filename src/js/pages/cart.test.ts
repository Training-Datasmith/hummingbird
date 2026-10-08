import initCart from './cart';
import {state, availableLastUpdateAction} from '@js/state';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

jest.mock('bootstrap', () => ({
  Collapse: class {
    show = jest.fn();
  },
}));

afterEach(() => {
  resetTestState();
});

describe('initCart', () => {
  beforeEach(() => {
    setupThemeWindow();
    global.fetch = jest.fn();
  });

  it('copies voucher code into input and opens accordion', () => {
    document.body.innerHTML = `
      <span class="js-voucher-code">SAVE10</span>
      <input class="js-voucher-input" />
      <div class="js-voucher-accordion"></div>
    `;
    initCart();
    const code = document.querySelector('.js-voucher-code') as HTMLElement;
    Object.defineProperty(code, 'innerText', {configurable: true, get: () => 'SAVE10'});
    code.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    const input = document.querySelector('.js-voucher-input') as HTMLInputElement;
    expect(input.value).toBe('SAVE10');
  });

  it('sets submit-voucher on voucher form submit', () => {
    document.body.innerHTML = '<form data-ps-ref="voucher-form"></form>';
    initCart();
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    expect(state.get('lastUpdateAction')).toBe(availableLastUpdateAction.SUBMIT_VOUCHER);
  });
});
