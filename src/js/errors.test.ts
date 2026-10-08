import initErrorHandler from './errors';
import * as Toastify from '@constants/mocks/useToast-data';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';
import EVENTS from '@constants/events-map';

afterEach(() => {
  resetTestState();
});

describe('initErrorHandler', () => {
  beforeAll(() => {
    setupThemeWindow();
    initErrorHandler();
  });

  beforeEach(() => {
    document.body.innerHTML = Toastify.WithContainerWithTemplate;
  });

  it('shows a toast per error string', () => {
    window.prestashop.emit(EVENTS.handleError, {resp: {errors: ['Out of stock', 'Limit']}});
    const toasts = document.querySelectorAll('.toast-body');
    expect(toasts.length).toBe(2);
    expect(toasts[0].textContent).toBe('Out of stock');
    expect(toasts[1].textContent).toBe('Limit');
  });

  it('does nothing when errors is missing', () => {
    window.prestashop.emit(EVENTS.handleError, {resp: {}});
    expect(document.querySelectorAll('.toast-body').length).toBe(0);
  });

  it('does nothing when errors is not an array', () => {
    window.prestashop.emit(EVENTS.handleError, {resp: {errors: 'nope'}});
    expect(document.querySelectorAll('.toast-body').length).toBe(0);
  });
});
