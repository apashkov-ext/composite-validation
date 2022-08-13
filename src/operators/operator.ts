import { ValueValidationError } from '../types';
import { Utils } from '../utils';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Custom validation function (returns true/false).
 */
export function operator(val: any, isValidFunc: () => boolean): any;
/**
 * If condition returns true value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Validity conditions represented by custom validation function (returns true/false).
 * @param condition Condition represented by function (returns true/false).
 */
export function operator(val: any, isValidFunc: () => boolean, condition: () => boolean): any;
/**
 * If condition returns true value must perform the specified conditions.
 * @param val Verified value.
 * @param isValidFunc Validity conditions represented custom validation function (returns true/false).
 * @param condition Condition represented by function (returns true/false).
 * @param error Error text or object.
 */
export function operator(val: any, isValidFunc: () => boolean, condition: () => boolean, error: string | ValueValidationError): any;

export function operator(val: any, isValidFunc: () => boolean,  condition: (() => boolean) | null = null, error: string | ValueValidationError | null = null): any {

    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }

    if (!isValidFunc || isValidFunc()) {
        return Utils.getWrappedValue(val);
    }

    return Utils.getErrorObject(!!error ? error : CompositeValidationOptions.errorMatch('invalid'));
}
