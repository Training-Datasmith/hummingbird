/**
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import EVENTS from '@constants/events-map';
import selectorsMap from '@constants/selectors-map';
import initEmitter from '@js/prestashop';
import {state} from '@js/state';

export const setupThemeWindow = (): void => {
  window.prestashop = window.prestashop ?? {};
  initEmitter();
  window.Theme = {
    events: EVENTS,
    selectors: selectorsMap,
  };
};

export const resetTestState = (): void => {
  document.body.innerHTML = '';
  document.documentElement.style.removeProperty('--scroll-padding-top');
  document.documentElement.style.removeProperty('scroll-padding-top');
  state.merge({
    lastUpdateAction: null,
    storedFocusElement: null,
    storedFocusElementId: null,
  });
  jest.restoreAllMocks();
  jest.useRealTimers();
};

export const formDataGet = (body: FormData | URLSearchParams, key: string): string | null => {
  const value = body.get(key);

  return value === null ? null : String(value);
};
