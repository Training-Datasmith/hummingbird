import debounce from './debounce';
import {resetTestState} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('debounce', () => {
  it('invokes callback once with the latest args when calls are within the wait window', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced('first');
    jest.advanceTimersByTime(50);
    debounced('second');
    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('invokes callback again after the wait window elapses', () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    const debounced = debounce(callback, 100);

    debounced('a');
    jest.advanceTimersByTime(100);
    debounced('b');
    jest.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(1, 'a');
    expect(callback).toHaveBeenNthCalledWith(2, 'b');
  });
});
