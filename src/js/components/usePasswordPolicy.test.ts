import usePasswordPolicy from './usePasswordPolicy';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

const passwordFixture = () => `
  <div data-ps-ref="password-field">
    <input data-ps-ref="password-policy-input" minlength="8" maxlength="72" data-minscore="3" value="" />
    <div data-ps-target="password-feedback-target"></div>
    <template data-ps-ref="password-feedback-template">
      <div data-ps-ref="password-feedback-container" class="d-none">
        <div data-ps-ref="password-strength-progress-bar" class="progress-bar"></div>
        <script type="text/javascript" data-ps-ref="password-strength-hints">{"3":"Strong","Straight rows of keys are easy to guess":"Avoid sequences"}</script>
        <div data-ps-ref="password-invalid-message" data-ps-data="weak"></div>
        <div data-ps-ref="password-valid-message" data-ps-data="valid"></div>
        <div data-ps-ref="password-length-message" data-ps-data="length"></div>
        <p data-ps-ref="password-requirements-length" data-translation="Enter a password between %s and %s characters"></p>
        <span data-ps-ref="password-requirements-length-message"></span>
        <p data-ps-ref="password-requirements-score" data-translation="The minimum score must be: %s"></p>
        <span data-ps-ref="password-requirements-score-message"></span>
        <i data-ps-ref="password-requirements-length-icon"></i>
        <i data-ps-ref="password-requirements-score-icon"></i>
        <div data-ps-target="password-announce-validity"></div>
      </div>
    </template>
  </div>
`;

describe('usePasswordPolicy', () => {
  beforeEach(() => {
    setupThemeWindow();
    window.prestashop.checkPasswordScore = jest.fn();
  });

  it('returns undefined when field is missing', () => {
    document.body.innerHTML = '';
    expect(usePasswordPolicy()).toBeUndefined();
  });

  it('hides feedback for empty password', async () => {
    document.body.innerHTML = passwordFixture();
    usePasswordPolicy();
    const input = document.querySelector('[data-ps-ref="password-policy-input"]') as HTMLInputElement;
    const container = document.querySelector('[data-ps-ref="password-feedback-container"]') as HTMLElement;
    input.dispatchEvent(new Event('input'));
    await Promise.resolve();
    expect(window.prestashop.checkPasswordScore).not.toHaveBeenCalled();
    expect(container.classList.contains('d-none')).toBe(true);
  });

  it('marks length invalid when too short', async () => {
    document.body.innerHTML = passwordFixture();
    (window.prestashop.checkPasswordScore as jest.Mock).mockResolvedValue({score: 4, feedback: {warning: '', suggestions: []}});
    usePasswordPolicy();
    const input = document.querySelector('[data-ps-ref="password-policy-input"]') as HTMLInputElement;
    Object.defineProperty(input, 'validity', {
      configurable: true,
      get: () => ({tooShort: true, tooLong: false}),
    });
    input.value = 'short';
    input.dispatchEvent(new Event('input'));
    await Promise.resolve();
    const lengthIcon = document.querySelector('[data-ps-ref="password-requirements-length-icon"]') as HTMLElement;
    expect(lengthIcon.classList.contains('text-danger')).toBe(true);
    expect(input.validationMessage).toContain('length');
  });

  it('shows weak password feedback for low score', async () => {
    document.body.innerHTML = passwordFixture();
    (window.prestashop.checkPasswordScore as jest.Mock).mockResolvedValue({
      score: 2,
      feedback: {warning: 'Straight rows of keys are easy to guess', suggestions: []},
    });
    usePasswordPolicy();
    const input = document.querySelector('[data-ps-ref="password-policy-input"]') as HTMLInputElement;
    Object.defineProperty(input, 'validity', {
      configurable: true,
      get: () => ({tooShort: false, tooLong: false}),
    });
    input.value = 'longpassword';
    input.dispatchEvent(new Event('input'));
    await Promise.resolve();
    const bar = document.querySelector('[data-ps-ref="password-strength-progress-bar"]') as HTMLElement;
    expect(bar.style.width).toBe('60%');
    expect(bar.classList.contains('bg-danger')).toBe(true);
    expect(input.validationMessage).toContain('Avoid sequences');
  });

  it('clears validity for strong password', async () => {
    document.body.innerHTML = passwordFixture();
    (window.prestashop.checkPasswordScore as jest.Mock).mockResolvedValue({score: 3, feedback: {warning: '', suggestions: []}});
    usePasswordPolicy();
    const input = document.querySelector('[data-ps-ref="password-policy-input"]') as HTMLInputElement;
    Object.defineProperty(input, 'validity', {
      configurable: true,
      get: () => ({tooShort: false, tooLong: false}),
    });
    input.value = 'longpassword';
    input.dispatchEvent(new Event('input'));
    await Promise.resolve();
    expect(input.validationMessage).toBe('');
  });
});
