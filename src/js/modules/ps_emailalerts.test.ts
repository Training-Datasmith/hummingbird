import initEmailalerts from './ps_emailalerts';
import * as Alertify from '@constants/mocks/useAlert-data';
import {formDataGet, resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initEmailalerts', () => {
  beforeAll(() => {
    setupThemeWindow();
    initEmailalerts();
  });

  beforeEach(() => {
    document.body.innerHTML = Alertify.NotificationsContainer;
    global.fetch = jest.fn();
  });

  it('subscribes with parsed form fields', async () => {
    document.body.innerHTML = `
      ${Alertify.NotificationsContainer}
      <div data-ps-ref="emailalerts" data-url="/subscribe">
        <div data-ps-ref="emailalerts-content"></div>
        <input data-ps-ref="emailalerts-email" value="user@example.com" />
        <button data-ps-action="emailalerts-subscribe" data-ps-data='{"id_product":"1","id_product_attribute":"0"}'></button>
        <div data-ps-target="emailalerts-alerts"></div>
      </div>
    `;
    (fetch as jest.Mock).mockResolvedValue({
      json: async () => ({error: false, message: 'OK'}),
    });
    const button = document.querySelector('[data-ps-action="emailalerts-subscribe"]') as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(fetch).toHaveBeenCalled();

    const body = new URLSearchParams((fetch as jest.Mock).mock.calls[0][1].body as string);
    expect(formDataGet(body, 'id_product')).toBe('1');
    expect(formDataGet(body, 'customer_email')).toBe('user@example.com');
    expect(document.querySelector('[data-ps-ref="emailalerts-content"]')?.classList.contains('d-none')).toBe(true);
  });

  it('removes product on successful unsubscribe', async () => {
    document.body.innerHTML = `
      <div data-ps-ref="emailalerts-product-list"></div>
      <div data-ps-ref="emailalerts-product">
        <button data-ps-action="emailalerts-delete" data-ps-data='{"id_product":"1","id_product_attribute":"0","url":"/del"}'></button>
      </div>
      <div data-ps-ref="emailalerts-account-no-alerts" class="d-none"></div>
    `;
    (fetch as jest.Mock).mockResolvedValue({text: async () => '0'});
    const button = document.querySelector('[data-ps-action="emailalerts-delete"]') as HTMLElement;
    button.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(fetch).toHaveBeenCalled();

    expect(document.querySelector('[data-ps-ref="emailalerts-product"]')).toBeNull();
    expect(document.querySelector('[data-ps-ref="emailalerts-account-no-alerts"]')?.classList.contains('d-none')).toBe(false);
  });
});
