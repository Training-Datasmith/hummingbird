import initVisiblePassword from './visible-password';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initVisiblePassword', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  it('toggles password visibility and aria-label', () => {
    document.body.innerHTML = `
      <input type="password" />
      <button data-ps-action="toggle-password" data-text-show="Show" data-text-hide="Hide">
        <i>visibility</i>
      </button>
    `;
    initVisiblePassword();
    const input = document.querySelector('input') as HTMLInputElement;
    const button = document.querySelector('button') as HTMLButtonElement;

    button.click();
    expect(input.type).toBe('text');
    expect(button.getAttribute('aria-label')).toBe('Hide');

    button.click();
    expect(input.type).toBe('password');
    expect(button.getAttribute('aria-label')).toBe('Show');
  });
});
