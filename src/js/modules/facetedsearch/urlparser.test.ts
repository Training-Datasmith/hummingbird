import getQueryParameters from './urlparser';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('getQueryParameters', () => {
  it('decodes percent-encoded spaces in values', () => {
    expect(getQueryParameters('q=red%20hat')).toEqual([{name: 'q', value: 'red hat'}]);
  });

  it('decodes plus as space', () => {
    expect(getQueryParameters('q=hello+world')).toEqual([{name: 'q', value: 'hello world'}]);
  });

  it('preserves plus sign when percent-encoded', () => {
    expect(getQueryParameters('q=a%2Bb')).toEqual([{name: 'q', value: 'a+b'}]);
  });

  it('returns empty value for flag without equals', () => {
    expect(getQueryParameters('flag')).toEqual([{name: 'flag', value: ''}]);
  });

  it('keeps extra equals in value', () => {
    expect(getQueryParameters('a=b=c')).toEqual([{name: 'a', value: 'b=c'}]);
  });

  it('returns empty array for empty input', () => {
    expect(getQueryParameters('')).toEqual([]);
  });
});
