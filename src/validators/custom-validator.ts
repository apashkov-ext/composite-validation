import { ValidatedValue, ValueValidationError } from '../types';
import { Utils } from '../utils';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * Value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Custom validation function (returns true/false).
 */
export function customValidator<T>(val: T, isValidFunc: () => boolean): ValidatedValue<T>;
/**
 * If condition returns true value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Validity conditions represented by custom validation function (returns true/false).
 * @param condition Condition represented by function (returns true/false).
 */
export function customValidator<T>(val: T, isValidFunc: () => boolean, condition: () => boolean): ValidatedValue<T>;
/**
 * If condition returns true value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Validity conditions represented custom validation function (returns true/false).
 * @param condition Condition represented by function (returns true/false).
 * @param error Error text or object.
 */
export function customValidator<T>(val: T, isValidFunc: () => boolean, condition: () => boolean, error: string | ValueValidationError<T>): ValidatedValue<T>;

export function customValidator<T>(val: T, isValidFunc: () => boolean,  condition: (() => boolean) | null = null, error: string | ValueValidationError<T> | null = null): ValidatedValue<T> {

    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }

    if (!isValidFunc || isValidFunc()) {
        return Utils.getWrappedValue(val);
    }

    return Utils.getErrorObject(val, !!error ? error : CompositeValidationOptions.errorMatch('invalid'));
}
