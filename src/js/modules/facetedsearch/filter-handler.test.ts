import filterHandler from './filter-handler';
import getQueryParameters from './urlparser';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';
import EVENTS from '@constants/events-map';

afterEach(() => {
  resetTestState();
});

describe('filterHandler', () => {
  beforeEach(() => {
    setupThemeWindow();
    window.$ = {
      param: (params: Array<{ name: string; value: string }>) => params
        .map((p) => `${p.name}=${encodeURIComponent(p.value)}`)
        .join('&'),
    } as typeof window.$;
    window.prestashop.emit = jest.fn();
  });

  const makeSlider = (encodedUrl: string, label = 'Price', unit = 'EUR') => ({
    target: {
      dataset: {
        sliderEncodedUrl: encodedUrl,
        sliderLabel: label,
        sliderUnit: unit,
      },
    },
  });

  it('emits updateFacets with encoded range in q', () => {
    filterHandler([10, 40], makeSlider('https://shop.test/cat') as never);

    expect(window.prestashop.emit).toHaveBeenCalledWith(EVENTS.updateFacets, expect.any(String));
    const url = (window.prestashop.emit as jest.Mock).mock.calls[0][1] as string;
    const query = url.split('?')[1];
    const params = getQueryParameters(query);
    const q = params.find((p) => p.name === 'q')?.value ?? '';
    expect(q).toContain('Price-EUR-10-40');
  });

  it('appends slider segment to existing q value', () => {
    filterHandler([1, 2], makeSlider('https://shop.test/cat?q=Color-Red') as never);

    const url = (window.prestashop.emit as jest.Mock).mock.calls[0][1] as string;
    const query = url.split('?')[1];
    const params = getQueryParameters(query);
    const q = params.find((p) => p.name === 'q')?.value ?? '';
    expect(q).toContain('Color-Red');
    expect(q).toContain('Price-EUR-1-2');
  });
});
