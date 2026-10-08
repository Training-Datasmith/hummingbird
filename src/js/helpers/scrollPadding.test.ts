import initScrollPaddingTop from './scrollPadding';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('initScrollPaddingTop', () => {
  it('sets scroll padding from sticky header height plus offset on resize', () => {
    document.body.innerHTML = '<header class="js-sticky-header"></header>';
    const header = document.querySelector('.js-sticky-header') as HTMLElement;
    Object.defineProperty(header, 'offsetHeight', {value: 40, configurable: true});

    initScrollPaddingTop();
    window.dispatchEvent(new Event('resize'));

    expect(document.documentElement.style.getPropertyValue('--scroll-padding-top')).toBe('56px');
    expect(document.documentElement.style.getPropertyValue('scroll-padding-top')).toBe('var(--scroll-padding-top)');
  });

  it('does not set scroll padding when header is absent', () => {
    document.body.innerHTML = '';
    initScrollPaddingTop();
    window.dispatchEvent(new Event('resize'));

    expect(document.documentElement.style.getPropertyValue('--scroll-padding-top')).toBe('');
  });
});
