import 'mocha';
import { expect } from 'chai';
import { equals } from '../../src/operators/equals';
import { ValueValidationError, WrappedValue } from '../../src/types';

describe('equals with no optional args', () => {

    it('should return instance of WrappedValue', () => {
        expect(equals(3, 3)).instanceOf(WrappedValue);
        expect(equals('', '')).instanceOf(WrappedValue);
        expect(equals(null, null)).instanceOf(WrappedValue);
        expect(equals(undefined, undefined)).instanceOf(WrappedValue);
        const instance = { id: 3 };
        expect(equals(instance, instance)).instanceOf(WrappedValue);
    });

    it('should return instance of ValueValidationError', () => {
        expect(equals(0, 3)).instanceOf(ValueValidationError);
        expect(equals(undefined, null)).instanceOf(ValueValidationError);
        expect(equals('888', '')).instanceOf(ValueValidationError);
        expect(equals({ id: 3 }, { id: 3 })).instanceOf(ValueValidationError);
    });

});

describe('equals with condition func', () => {

    describe('condition func returns true', () => {
        it('should return instance of WrappedValue', () => {
            expect(equals(0, 0, () => true)).instanceOf(WrappedValue);
        });
    });

    describe('condition func returns false', () => {
        it('should return instance of WrappedValue', () => {
            expect(equals(0, 3, () => false)).instanceOf(WrappedValue);
        });
    });

});

describe('equals with defined error', () => {

    describe('error text', () => {
        it('should return instance of ValueValidationError with text', () => {
            const err = 'Incorrect value';
            const res = equals(1, 0, null, err) as ValueValidationError<number>;
            expect(res.error).eq(err);
        });

    });

    describe('error object', () => {
        it('should return instance of WrappedValue', () => {
            const err = new ValueValidationError(1, 'Error');
            const res = equals(1, 0, null, err) as ValueValidationError<number>;
            expect(res).eq(err);
        });
    });

});