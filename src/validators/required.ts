import { Utils } from '../utils';
import { ValidatedValue, ValueValidationError } from '../types';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * Value is required (should be defined).
 * @param val Verified value.
 */
export function required<T>(val: T): ValidatedValue<T>;
/**
 * If condition returns true value is required (should be defined).
 * @param val Verified value.
 * @param condition Condition represented by function (returns true/false).
 */
export function required<T>(val: T, condition: () => boolean): ValidatedValue<T>;
/**
 * If condition returns true value is required (should be defined).
 * @param val Verified value.
 * @param condition Condition represented by function (returns true/false).
 * @param error Error text or object.
 */
export function required<T>(val: T, condition: () => boolean, error: string | ValueValidationError<T>): ValidatedValue<T>;

export function required<T>(val: T, condition: (() => boolean) | null = null, error: string | ValueValidationError<T> | null = null): ValidatedValue<T> {
    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }
    if (val === undefined || val === null || (typeof val === 'string' && !val)) {
        return Utils.getErrorObject(val, !!error ? error : CompositeValidationOptions.errorMatch('required'), true);
    }
    return Utils.getWrappedValue(val, true);
}
