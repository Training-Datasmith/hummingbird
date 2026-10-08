import initGuestPasswordToggle from './guest-password-toggle';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initGuestPasswordToggle', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  it('shows password wrapper when guest checkbox is checked', () => {
    document.body.innerHTML = `
      <input type="checkbox" class="js-password-form__check" />
      <div class="js-password-form__input-wrapper d-none">
        <input type="password" value="secret" />
      </div>
    `;
    initGuestPasswordToggle();
    const checkbox = document.querySelector('input') as HTMLInputElement;
    const wrapper = document.querySelector('.js-password-form__input-wrapper') as HTMLElement;

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(wrapper.classList.contains('d-none')).toBe(false);
  });

  it('hides wrapper and clears password when unchecked', () => {
    document.body.innerHTML = `
      <input type="checkbox" class="js-password-form__check" checked />
      <div class="js-password-form__input-wrapper">
        <input type="password" value="secret" />
      </div>
    `;
    initGuestPasswordToggle();
    const checkbox = document.querySelector('input') as HTMLInputElement;
    const password = document.querySelector('input[type="password"]') as HTMLInputElement;
    const wrapper = document.querySelector('.js-password-form__input-wrapper') as HTMLElement;

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));

    expect(wrapper.classList.contains('d-none')).toBe(true);
    expect(password.value).toBe('');
  });
});
