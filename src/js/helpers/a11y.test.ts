import A11yHelpers from './a11y';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('A11yHelpers', () => {
  it('setFocus stores element and focuses it', () => {
    document.body.innerHTML = '<button id="cart-line">line</button>';
    const a11y = new A11yHelpers();
    const el = document.getElementById('cart-line') as HTMLElement;

    a11y.setFocus(el);

    expect(document.activeElement).toBe(el);
    expect(a11y.getStoredFocusId()).toBe('cart-line');
  });

  it('restoreFocus focuses stored id and clears state', () => {
    document.body.innerHTML = '<button id="cart-line">line</button>';
    const a11y = new A11yHelpers();
    const el = document.getElementById('cart-line') as HTMLElement;
    a11y.setFocus(el);

    expect(a11y.restoreFocus()).toBe(true);
    expect(document.activeElement).toBe(el);
    expect(a11y.getStoredFocus()).toBeNull();
  });

  it('restoreFocus uses fallback when stored id is missing', () => {
    document.body.innerHTML = '<button id="overview">overview</button>';
    const a11y = new A11yHelpers();
    const fallback = document.getElementById('overview') as HTMLElement;

    a11y.restoreFocus(fallback);

    expect(document.activeElement).toBe(fallback);
  });

  it('clearStoredFocus removes stored focus', () => {
    document.body.innerHTML = '<button id="x">x</button>';
    const a11y = new A11yHelpers();
    a11y.setFocus(document.getElementById('x') as HTMLElement);
    a11y.clearStoredFocus();

    expect(a11y.getStoredFocus()).toBeNull();
    expect(a11y.getStoredFocusId()).toBeNull();
  });
});
