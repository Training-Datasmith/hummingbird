import ThemeState from './state';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('ThemeState', () => {
  it('get and set return stored values', () => {
    const themeState = new ThemeState();
    themeState.set('lastUpdateAction', 'delete-from-cart');
    expect(themeState.get('lastUpdateAction')).toBe('delete-from-cart');
  });

  it('merge updates only provided keys', () => {
    const themeState = new ThemeState();
    themeState.set('storedFocusElementId', 'a');
    themeState.merge({storedFocusElementId: 'b'});
    expect(themeState.get('storedFocusElementId')).toBe('b');
    expect(themeState.get('lastUpdateAction')).toBeNull();
  });

  it('instances do not share state', () => {
    const a = new ThemeState();
    const b = new ThemeState();
    a.set('lastUpdateAction', 'submit-voucher');
    expect(b.get('lastUpdateAction')).toBeNull();
  });
});
