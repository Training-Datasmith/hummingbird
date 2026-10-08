/// <reference path="../../../types/validator.d.ts" />
import parseData from './parseData';
import {resetTestState, setupThemeWindow} from '@js/test/testHelpers';

afterEach(() => {
  resetTestState();
});

describe('parseData', () => {
  beforeEach(() => {
    setupThemeWindow();
  });

  it('returns parsed data when validator passes', () => {
    document.body.innerHTML = '<div id="el" data-ps-data=\'{"id":"7"}\'></div>';
    const el = document.getElementById('el') as HTMLElement;
    const validator: Validator<{ id: string }> = (data): data is { id: string } => (
      typeof data === 'object' && data !== null && typeof (data as { id: string }).id === 'string'
    );

    expect(parseData(el, validator)).toEqual({id: '7'});
  });

  it('returns null when data-ps-data is missing', () => {
    document.body.innerHTML = '<div id="el"></div><div id="ok" data-ps-data=\'{"id":"1"}\'></div>';
    const el = document.getElementById('el') as HTMLElement;
    const validator: Validator<{ id: string }> = (data): data is { id: string } => (
      typeof data === 'object' && data !== null
    );

    expect(parseData(el, validator)).toBeNull();
    expect(parseData(document.getElementById('ok') as HTMLElement, validator)).toEqual({id: '1'});
  });

  it('returns null and logs on invalid JSON', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    document.body.innerHTML = '<div id="el" data-ps-data="not-json"></div>';
    const el = document.getElementById('el') as HTMLElement;
    const validator: Validator<Record<string, unknown>> = (data): data is Record<string, unknown> => typeof data === 'object' && data !== null;

    expect(parseData(el, validator)).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('returns null and warns when validator rejects', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    document.body.innerHTML = '<div id="el" data-ps-data=\'{"n":1}\'></div>';
    const el = document.getElementById('el') as HTMLElement;
    const validator: Validator<{ id: string }> = (_data): _data is { id: string } => false;

    expect(parseData(el, validator)).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});
