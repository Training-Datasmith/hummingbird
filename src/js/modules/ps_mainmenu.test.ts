import initDesktopMenu from './ps_mainmenu';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

const menuFixture = () => `
  <div data-ps-ref="desktop-menu-container">
    <a data-ps-ref="desktop-menu-link" href="#" id="menu-link-a">A</a>
    <li data-ps-ref="desktop-menu-item">
      <a data-ps-ref="desktop-menu-link" href="#" id="menu-link-b">B</a>
      <button type="button" data-ps-ref="desktop-menu-dropdown-toggle" id="menu-dropdown" aria-expanded="false">More</button>
      <div data-ps-ref="desktop-submenu" style="display: none">
        <div data-ps-ref="desktop-submenu-left">
          <a href="#" data-ps-ref="desktop-submenu-left-item" data-open-tab="panel-b" data-ps-has-child="true" id="sub-left">Left</a>
        </div>
        <div data-ps-ref="desktop-submenu-right">
          <div data-ps-ref="desktop-submenu-right-items" id="panel-b" class="not-active">Panel B</div>
        </div>
      </div>
    </li>
    <a data-ps-ref="desktop-menu-link" href="#" id="menu-link-c">C</a>
  </div>
`;

describe('initDesktopMenu', () => {
  beforeEach(() => {
    setupThemeWindow();
    document.body.innerHTML = menuFixture();
    initDesktopMenu();
  });

  it('wraps focus from the first link to the last on ArrowLeft', () => {
    const first = document.getElementById('menu-link-a') as HTMLElement;
    const last = document.getElementById('menu-link-c') as HTMLElement;
    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
    expect(document.activeElement).toBe(last);
  });

  it('opens submenu and sets aria-expanded on Enter', () => {
    const dropdown = document.getElementById('menu-dropdown') as HTMLButtonElement;
    const subMenu = document.querySelector('[data-ps-ref="desktop-submenu"]') as HTMLElement;
    dropdown.focus();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}));
    expect(dropdown.getAttribute('aria-expanded')).toBe('true');
    expect(subMenu.style.display).toBe('block');
  });

  it('activates the submenu panel for the focused left item', () => {
    const left = document.getElementById('sub-left') as HTMLElement;
    const panel = document.getElementById('panel-b') as HTMLElement;
    left.focus();
    left.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
    expect(left.getAttribute('aria-selected')).toBe('true');
    expect(panel.classList.contains('active')).toBe(true);
  });
});
