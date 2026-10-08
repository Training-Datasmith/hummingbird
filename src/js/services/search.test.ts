import {searchProduct} from './search';
import {formDataGet, resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('searchProduct', () => {
  it('posts FormData with search term and resultsPerPage', async () => {
    const product = {
      id_product: 3,
      name: 'Mug',
      canonical_url: '/mug',
      cover: {small: {url: '/m.jpg'}, legend: 'Mug'},
    };
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({products: [product]}),
    });
    global.fetch = fetchMock;

    const result = await searchProduct('/search', 'mug', 5);

    expect(result).toEqual([product]);
    expect(fetchMock).toHaveBeenCalledWith('/search', expect.objectContaining({method: 'POST'}));
    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(formDataGet(body, 's')).toBe('mug');
    expect(formDataGet(body, 'resultsPerPage')).toBe('5');
    expect(fetchMock.mock.calls[0][1].headers.Accept).toContain('application/json');
  });

  it('defaults resultsPerPage to 10', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      json: async () => ({products: []}),
    });
    global.fetch = fetchMock;

    await searchProduct('/search', 'x');

    const body = fetchMock.mock.calls[0][1].body as FormData;
    expect(formDataGet(body, 'resultsPerPage')).toBe('10');
  });
});
