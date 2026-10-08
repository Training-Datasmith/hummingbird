import getModalContentContainer from './modal';
import selectorsMap from '@constants/selectors-map';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('getModalContentContainer', () => {
  it('returns modal container when present', () => {
    document.body.innerHTML = '<div data-ps-target="modal-container"></div>';
    const node = getModalContentContainer();
    expect(node.getAttribute('data-ps-target')).toBe('modal-container');
  });

  it('throws when modal container is missing', () => {
    document.body.innerHTML = '';
    expect(() => getModalContentContainer()).toThrow(selectorsMap.modalContainer);
  });
});
