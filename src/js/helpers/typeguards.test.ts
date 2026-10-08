import {isHTMLElement} from './typeguards';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('typeguards', () => {
  it('isHTMLElement returns true for HTMLElement', () => {
    expect(isHTMLElement(document.createElement('div'))).toBe(true);
  });

  it('isHTMLElement returns false for text nodes', () => {
    expect(isHTMLElement(document.createTextNode('x'))).toBe(false);
  });

  it('isHTMLElement returns false for null without throwing', () => {
    expect(() => isHTMLElement(null)).not.toThrow();
    expect(isHTMLElement(null)).toBe(false);
  });
});
