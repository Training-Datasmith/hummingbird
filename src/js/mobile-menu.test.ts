import initMobileMenu from './mobile-menu';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initMobileMenu', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  it('opens child menu and updates back title', () => {
    document.body.innerHTML = `
      <div class="js-menu-canvas"></div>
      <button class="js-menu-open-child" data-target="child-1"></button>
      <button class="js-back-button d-none"></button>
      <span class="js-menu-back-title">Home</span>
      <div class="menu--current js-menu-current" data-depth="2"></div>
      <div class="menu menu--child js-menu-child" data-id="child-1" data-back-title="Child" data-depth="3"></div>
    `;
    initMobileMenu();
    const open = document.querySelector('.js-menu-open-child') as HTMLButtonElement;
    open.click();
    const child = document.querySelector('[data-id="child-1"]') as HTMLElement;
    expect(child.classList.contains('menu--current')).toBe(true);
    expect(document.querySelector('.js-menu-back-title')?.innerHTML).toBe('Child');
  });

  it('does not throw when offcanvas hides without current menu', () => {
    document.body.innerHTML = '<div class="js-menu-canvas"></div>';
    initMobileMenu();
    const canvas = document.querySelector('.js-menu-canvas') as HTMLElement;
    expect(() => canvas.dispatchEvent(new Event('hidden.bs.offcanvas'))).not.toThrow();
  });
});
