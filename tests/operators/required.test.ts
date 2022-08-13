import 'mocha';
import { expect } from 'chai';
import { required } from '../../src/operators/required';
import { ValueValidationError, WrappedValue } from '../../src/types';

describe('required with no optional args', () => {

  it('should return instance of WrappedValue', () => {
    expect(required(3)).instanceOf(WrappedValue);
    expect(required(0)).instanceOf(WrappedValue);
    expect(required('888')).instanceOf(WrappedValue);
    expect(required({})).instanceOf(WrappedValue);
    expect(required(true)).instanceOf(WrappedValue);
    expect(required(false)).instanceOf(WrappedValue);
  });

  it('should return instance of ValueValidationError', () => {
    expect(required(undefined)).instanceOf(ValueValidationError);
    expect(required(null)).instanceOf(ValueValidationError);
    expect(required('')).instanceOf(ValueValidationError);
  });

});

describe('required with condition func', () => {

  describe('condition func returns true', () => {
    it('should return instance of WrappedValue', () => {
      expect(required(0, () => true)).instanceOf(WrappedValue);
    });

    it('should return instance of ValueValidationError', () => {
      expect(required(undefined, () => true)).instanceOf(ValueValidationError);
    });
  });

  describe('condition func returns false', () => {
    it('should return instance of WrappedValue', () => {
      expect(required(undefined, () => false)).instanceOf(WrappedValue);
    });
  });

});

describe('required with defined error', () => {

  describe('error text', () => {
    it('should return instance of ValueValidationError with text', () => {
      const err = 'Incorrect value';
      const res = required(null, null, err) as ValueValidationError;
      expect(res.error).eq(err);
    });

  });

  describe('error object', () => {
    it('should return instance of WrappedValue', () => {
      const err = new ValueValidationError('Error');
      const res = required(null, null, err) as ValueValidationError;
      expect(res).eq(err);
    });
  });

});