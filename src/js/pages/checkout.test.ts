import initCheckout from './checkout';
import EVENTS from '@constants/events-map';
import * as ProgressRingMockData from '@constants/mocks/useProgressRing-data';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

const checkoutFixture = () => `
  ${ProgressRingMockData.Template}
  <div class="js-step-item" data-step="checkout-personal">
    <button data-ps-ref="step-button">Personal</button>
  </div>
  <div class="js-step-item" data-step="checkout-addresses">
    <button data-ps-ref="step-button">Addresses</button>
  </div>
  <div class="js-step-item" data-step="checkout-shipping">
    <button data-ps-ref="step-button">Shipping</button>
  </div>
  <div id="checkout-personal" class="step--complete step--reachable"></div>
  <div id="checkout-addresses" class="step--current step--reachable js-current-step step--current"></div>
  <div id="checkout-shipping" class="step--unreachable"></div>
  <div class="checkout-steps__step-mobile d-none" data-step="checkout-personal"></div>
  <div class="checkout-steps__step-mobile checkout-steps__step-mobile--shown d-none" data-step="checkout-addresses"></div>
  <div class="checkout-steps__step-mobile d-none" data-step="checkout-shipping"></div>
  <div class="js-carrier-extra" id="carrier-a"></div>
`;

describe('initCheckout', () => {
  beforeEach(() => {
    setupThemeWindow();
    document.body.innerHTML = checkoutFixture();
    initCheckout();
  });

  it('marks complete and current steps and sets progress text', () => {
    const steps = document.querySelectorAll('.js-step-item');
    expect(steps[0].classList.contains('checkout-steps__step--success')).toBe(true);
    expect(steps[1].classList.contains('checkout-steps__step--current')).toBe(true);
    expect(steps[2].querySelector('button')?.hasAttribute('disabled')).toBe(true);
    expect(document.querySelector('.progress-ring text')?.textContent).toBe('2 / 3');
  });

  it('updates progress when a reachable step button is clicked', () => {
    const personalButton = document.querySelectorAll('.js-step-item')[0].querySelector('button') as HTMLButtonElement;
    personalButton.click();
    expect(document.querySelector('.progress-ring text')?.textContent).toBe('1 / 3');
    expect(document.getElementById('checkout-personal')?.classList.contains('js-current-step')).toBe(true);
  });

  it('sets data-active on the selected carrier wrapper only', () => {
    document.getElementById('carrier-a')?.setAttribute('data-active', '');
    const option = document.createElement('div');
    option.innerHTML = '<div class="js-carrier-extra" id="carrier-selected"></div>';
    window.prestashop.emit(EVENTS.updatedDeliveryForm, {deliveryOption: [option]});
    expect(document.getElementById('carrier-a')?.hasAttribute('data-active')).toBe(false);
    expect(option.querySelector('#carrier-selected')?.hasAttribute('data-active')).toBe(true);
  });
});
