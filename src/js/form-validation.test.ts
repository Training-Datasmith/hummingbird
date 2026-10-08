import initFormValidation from './form-validation';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initFormValidation', () => {
  beforeEach(() => {
    setupThemeWindow();
    HTMLFormElement.prototype.reportValidity = jest.fn();
  });

  it('prevents submit when form is invalid', () => {
    document.body.innerHTML = `
      <form data-ps-action="form-validation">
        <input required name="email" />
        <button type="button" data-ps-action="form-validation-submit">Go</button>
      </form>
    `;
    initFormValidation();
    const form = document.querySelector('form') as HTMLFormElement;
    const button = document.querySelector('button') as HTMLButtonElement;
    jest.spyOn(form, 'checkValidity').mockReturnValue(false);
    const event = new MouseEvent('click', {cancelable: true});
    button.dispatchEvent(event);

    expect(form.classList.contains('was-validated')).toBe(true);
    expect(event.defaultPrevented).toBe(true);
  });

  it('does not prevent submit when form is valid', () => {
    document.body.innerHTML = `
      <form data-ps-action="form-validation">
        <input required name="email" value="a@b.c" />
        <button type="button" data-ps-action="form-validation-submit">Go</button>
      </form>
    `;
    initFormValidation();
    const form = document.querySelector('form') as HTMLFormElement;
    const button = document.querySelector('button') as HTMLButtonElement;
    jest.spyOn(form, 'checkValidity').mockReturnValue(true);
    const event = new MouseEvent('click', {cancelable: true});
    button.dispatchEvent(event);

    expect(form.classList.contains('was-validated')).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });
});
