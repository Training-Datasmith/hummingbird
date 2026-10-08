import {initSliders} from './index';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

jest.mock('nouislider', () => {
  const instances: Record<string, unknown> = {};

  return {
    __esModule: true,
    default: {
      create: jest.fn((container: HTMLElement) => {
        const api = {
          on: jest.fn(),
          removeTooltips: jest.fn(),
          target: container,
        };
        (container as HTMLElement & { noUiSlider: typeof api }).noUiSlider = api;
        instances.create = api;
        return api;
      }),
    },
  };
});

afterEach(() => {
  resetTestState();
});

describe('initSliders', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  const sliderFixture = (extra = '') => `
    <div class="js-faceted-filter-slider">
      <div class="js-faceted-slider-container"
        data-slider-min="0"
        data-slider-max="100"
        data-slider-values="[1,9]"
        data-slider-unit="kg"
        data-slider-specifications="null"
        data-slider-direction="0"
        ${extra}
      >
        <div class="noUi-handle"></div>
      </div>
      <div class="js-faceted-values"></div>
    </div>
  `;

  it('sets aria-label on handle without currency', () => {
    document.body.innerHTML = sliderFixture();
    initSliders();
    const handle = document.querySelector('.noUi-handle') as HTMLElement;
    expect(handle.getAttribute('aria-label')).toBe('Adjust filter range in kg');
  });

  it('sets aria-label with currency when provided', () => {
    document.body.innerHTML = sliderFixture('data-slider-currency="EUR"');
    initSliders();
    const handle = document.querySelector('.noUi-handle') as HTMLElement;
    expect(handle.getAttribute('aria-label')).toBe('Adjust filter range in EUR');
  });

  it('updates range values when slider already exists', () => {
    document.body.innerHTML = sliderFixture();
    const container = document.querySelector('.js-faceted-slider-container') as HTMLElement;
    const updateHandler = jest.fn();
    (container as HTMLElement & { noUiSlider: Record<string, unknown> }).noUiSlider = {
      updateOptions: jest.fn(),
      removeTooltips: jest.fn(),
      on: jest.fn((event: string, cb: (values: string[]) => void) => {
        if (event === 'update') {
          updateHandler.mockImplementation(cb);
        }
      }),
      target: container,
    };

    initSliders();
    updateHandler(['1.00', '9.00']);

    const valuesEl = document.querySelector('.js-faceted-values') as HTMLElement;
    expect(valuesEl.innerHTML).toBe('1.00kg - 9.00kg');
  });
});
