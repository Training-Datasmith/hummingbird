import initFacetedSearch, {parseSearchUrl, updateProductListDOM} from './update';
import EVENTS from '@constants/events-map';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('facetedsearch update', () => {
  beforeEach(() => {
    setupThemeWindow();
    window.prestashop.on = jest.fn();
    window.prestashop.emit = jest.fn();
  });

  it('parseSearchUrl returns data-search-url from ancestor', () => {
    document.body.innerHTML = '<label><input data-search-url="/s?q=1" /></label>';
    const input = document.querySelector('input') as HTMLElement;
    const event = {target: input} as unknown as Event;
    expect(parseSearchUrl(event)).toBe('/s?q=1');
  });

  it('parseSearchUrl throws when url missing', () => {
    document.body.innerHTML = '<button id="b"></button>';
    const event = {target: document.getElementById('b')} as Event;
    expect(() => parseSearchUrl(event)).toThrow('Cannot parse search URL');
  });

  it('updateProductListDOM replaces list and keeps top when top html empty', () => {
    document.body.innerHTML = `
      <div id="js-product-list-top">top</div>
      <div id="js-product-list">old</div>
    `;
    updateProductListDOM({
      rendered_products: '<div id="js-product-list">new</div>',
      rendered_products_top: '',
    });

    expect(document.querySelector('#js-product-list')?.textContent).toBe('new');
    expect(document.querySelector('#js-product-list-top')?.textContent).toBe('top');
  });

});

describe('initFacetedSearch delegation', () => {
  beforeAll(() => {
    setupThemeWindow();
    window.prestashop.on = jest.fn();
    window.prestashop.emit = jest.fn();
    initFacetedSearch();
  });

  beforeEach(() => {
    (window.prestashop.emit as jest.Mock).mockClear();
  });

  afterEach(() => {
    document.body.innerHTML = '<div id="js-product-list"></div>';
  });

  it('emits updateFacets on filter input change', () => {
    document.body.innerHTML = `
      <div id="js-product-list"></div>
      <div id="search-filters"><input data-search-url="/facet" type="checkbox" /></div>
    `;
    const input = document.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('change', {bubbles: true}));

    expect(window.prestashop.emit).toHaveBeenCalledWith(EVENTS.updateFacets, '/facet');
  });

  it('prevents default and emits href on search link click', () => {
    document.body.innerHTML = `
      <div id="js-product-list"></div>
      <div id="search-filters"><a class="js-search-link" href="/cat?color=red">link</a></div>
    `;
    const link = document.querySelector('a') as HTMLAnchorElement;
    const event = new MouseEvent('click', {bubbles: true, cancelable: true});
    Object.defineProperty(event, 'target', {value: link});
    document.body.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(window.prestashop.emit).toHaveBeenCalledWith(EVENTS.updateFacets, '/cat?color=red');
  });
});
