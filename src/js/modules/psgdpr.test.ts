import initGdpr from './psgdpr';
import {formDataGet, resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initGdpr', () => {
  beforeAll(() => {
    setupThemeWindow();
    initGdpr();
  });

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ok: true});
  });

  it('disables submit until consent is checked', () => {
    document.body.innerHTML = `
      <div data-ps-component="gdpr">
        <div data-ps-ref="gdpr-consent" data-ps-data='{"id_module":"1","front_controller":"/gdpr","id_customer":"2","customer_token":"t","id_guest":"3","guest_token":"g"}'>
          <input data-ps-ref="gdpr-checkbox" type="checkbox" />
        </div>
        <button type="submit" data-ps-ref="gdpr-submit">Send</button>
      </div>
    `;
    window.prestashop.emit('updatedProduct');
    const checkbox = document.querySelector('[data-ps-ref="gdpr-checkbox"]') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', {bubbles: true}));
    expect(button.disabled).toBe(false);
  });

  it('logs consent with parsed fields when checked', () => {
    document.body.innerHTML = `
      <form>
        <div data-ps-ref="gdpr-consent" data-ps-data='{"id_module":"9","front_controller":"https://shop.test/gdpr?a=1&amp;b=2","id_customer":"2","customer_token":"t","id_guest":"3","guest_token":"g"}'>
          <input data-ps-ref="gdpr-checkbox" type="checkbox" checked />
        </div>
        <button type="submit">Send</button>
      </form>
    `;
    const form = document.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit', {bubbles: true}));

    expect(fetch).toHaveBeenCalledWith(
      'https://shop.test/gdpr?a=1&b=2',
      expect.objectContaining({method: 'POST'}),
    );
    const body = new URLSearchParams((fetch as jest.Mock).mock.calls[0][1].body as string);
    expect(formDataGet(body, 'action')).toBe('AddLog');
    expect(formDataGet(body, 'ajax')).toBe('true');
    expect(formDataGet(body, 'id_module')).toBe('9');
  });
});
