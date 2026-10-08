import initQuickview from './quickview';
import EVENTS from '@constants/events-map';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initQuickview', () => {
  beforeAll(() => {
    setupThemeWindow();
    window.prestashop.urls = {pages: {product: '/product'}};
    initQuickview();
  });

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('posts quickview ids from product miniature', () => {
    document.body.innerHTML = `
      <div class="js-product-miniature" data-id-product="8" data-id-product-attribute="2">
        <button data-ps-ref="quickview-button" data-ps-action="open-quickview"></button>
      </div>
    `;
    const button = document.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(fetch).toHaveBeenCalledWith('/product', expect.objectContaining({method: 'POST'}));
    const body = (fetch as jest.Mock).mock.calls[0][1].body as URLSearchParams;
    expect(body.get('action')).toBe('quickview');
    expect(body.get('id_product')).toBe('8');
    expect(body.get('id_product_attribute')).toBe('2');
  });

  it('emits handleError when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('fail'));
    document.body.innerHTML = `
      <div class="js-product-miniature" data-id-product="1" data-id-product-attribute="0">
        <button data-ps-ref="quickview-button" data-ps-action="open-quickview"></button>
      </div>
    `;
    const emitSpy = jest.spyOn(window.prestashop, 'emit');
    document.querySelector('button')?.click();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(emitSpy).toHaveBeenCalledWith(EVENTS.handleError, expect.objectContaining({
      eventType: 'clickQuickView',
    }));
  });
});
