import initCustomer from './customer';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initCustomer', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  it('select-all toggles enabled product checkboxes only', () => {
    document.body.innerHTML = `
      <input data-ps-ref="select-all-products" type="checkbox" />
      <input data-ps-ref="select-product" type="checkbox" />
      <input data-ps-ref="select-product" type="checkbox" disabled />
    `;
    initCustomer();
    const selectAll = document.querySelector('[data-ps-ref="select-all-products"]') as HTMLInputElement;
    const boxes = document.querySelectorAll('[data-ps-ref="select-product"]') as NodeListOf<HTMLInputElement>;

    selectAll.checked = true;
    selectAll.dispatchEvent(new Event('click'));
    expect(boxes[0].checked).toBe(true);
    expect(boxes[1].checked).toBe(false);

    selectAll.checked = false;
    selectAll.dispatchEvent(new Event('click'));
    expect(boxes[0].checked).toBe(false);
  });
});
