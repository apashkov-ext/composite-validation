import { ValidatedValue, ValueValidationError } from '../types';
import { Utils } from '../utils';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * Value should be equal to target.
 * @param val Verified value.
 * @param target Target value.
 */
export function equals<T>(val: T, target: T): ValidatedValue<T>;
/**
 * Value should be equal to target.
 * @param val Verified value.
 * @param target Function that returns target value.
 */
export function equals<T>(val: T, target: () => T): ValidatedValue<T>;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Target value.
 * @param condition Condition represented by function (returns true/false).
 */
export function equals<T>(val: T, target: T, condition: () => boolean): ValidatedValue<T>;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Function that returns target value.
 * @param condition Condition represented by function (returns true/false).
 */
export function equals<T>(val: T, target: () => T, condition: () => boolean): ValidatedValue<T>;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Target value.
 * @param condition Condition represented by function (returns true/false).
 * @param error The error text or an error object.
 */
export function equals<T>(val: T, target: T, condition: () => boolean, error: string | ValueValidationError<T>): ValidatedValue<T>;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Function that returns target value.
 * @param condition Condition represented by function (returns true/false).
 * @param error The error text or an error object.
 */
export function equals<T>(val: T, target: () => T, condition: () => boolean, error: string | ValueValidationError<T>): ValidatedValue<T>;

export function equals<T>(val: T, target: T | (() => T),  condition: (() => boolean) | null = null, error: string | ValueValidationError<T> | null = null): ValidatedValue<T> {
    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }
    const trg = getTargetValue(target);
    if (val !== trg) {
        return Utils.getErrorObject(val, !!error ? error : CompositeValidationOptions.errorMatch('equals'), false, [trg]);
    }
    return Utils.getWrappedValue(val);
}

function getTargetValue<T>(target: any): T {
    if (target != null && typeof target === 'function') return target();
    if ( typeof target === 'object') return target;
    throw new Error('Incorrect target value')
}
