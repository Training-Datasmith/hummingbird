import initSearchbar from './ps_searchbar';
import {searchProduct} from '@services/search';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

jest.mock('@services/search', () => ({
  searchProduct: jest.fn(),
}));

afterEach(() => {
  resetTestState();
});

const searchFixture = () => `
  <div class="js-search-offcanvas"></div>
  <div class="js-search-widget" data-search-controller-url="/search">
    <input class="js-search-input" />
    <button class="js-search-clear d-none" tabindex="-1"></button>
    <div class="js-search-dropdown d-none"></div>
    <div class="js-search-results"></div>
    <template class="js-search-template">
      <a data-ps-ref="searchbar-result-link" href="#"><p></p><img /></a>
    </template>
  </div>
`;

describe('initSearchbar', () => {
  beforeEach(() => {
    setupThemeWindow();
    jest.useFakeTimers();
    (searchProduct as jest.Mock).mockClear();
  });

  it('debounces search requests', async () => {
    document.body.innerHTML = searchFixture();
    (searchProduct as jest.Mock).mockResolvedValue([]);
    initSearchbar();
    const input = document.querySelector('.js-search-input') as HTMLInputElement;

    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'a'}));
    jest.advanceTimersByTime(100);
    input.value = 'ab';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'b'}));
    jest.advanceTimersByTime(250);
    await Promise.resolve();

    expect(searchProduct).toHaveBeenCalledTimes(1);
    expect((searchProduct as jest.Mock).mock.calls[0][1]).toBe('ab');
  });

  it('uses textContent for product titles', async () => {
    document.body.innerHTML = searchFixture();
    (searchProduct as jest.Mock).mockResolvedValue([{
      id_product: 1,
      name: '<b>Coat</b>',
      canonical_url: '/coat',
      cover: {small: {url: '/c.jpg'}, legend: 'Coat'},
    }]);
    initSearchbar();
    const input = document.querySelector('.js-search-input') as HTMLInputElement;
    input.value = 'coat';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'c'}));
    jest.advanceTimersByTime(250);
    await Promise.resolve();

    const title = document.querySelector('.js-search-results p') as HTMLElement;
    expect(title.textContent).toBe('<b>Coat</b>');
    expect(title.querySelector('b')).toBeNull();
  });

  it('does not add a new outside click listener on each search response', async () => {
    document.body.innerHTML = searchFixture();
    (searchProduct as jest.Mock).mockResolvedValue([{
      id_product: 1,
      name: 'A',
      canonical_url: '/a',
      cover: {small: {url: '/a.jpg'}, legend: 'A'},
    }]);
    const clickAdds: unknown[] = [];
    const originalAdd = window.addEventListener.bind(window);
    jest.spyOn(window, 'addEventListener').mockImplementation((type, listener, options) => {
      if (type === 'click') {
        clickAdds.push(listener);
      }
      return originalAdd(type, listener, options);
    });
    initSearchbar();
    const input = document.querySelector('.js-search-input') as HTMLInputElement;

    input.value = 'one';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'o'}));
    jest.advanceTimersByTime(250);
    await Promise.resolve();
    const afterFirst = clickAdds.length;
    input.value = 'two';
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 't'}));
    jest.advanceTimersByTime(250);
    await Promise.resolve();

    expect(clickAdds.length).toBe(afterFirst);
  });
});
