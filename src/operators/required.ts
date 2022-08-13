import { Utils } from '../utils';
import { ValueValidationError } from '../types';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * Value is required (should be defined).
 * @param val Verified value.
 */
export function required<T>(val: T): any;
/**
 * If condition returns true value is required (should be defined).
 * @param val Verified value.
 * @param condition Condition represented by function (returns true/false).
 */
export function required(val: any, condition: () => boolean): any;
/**
 * If condition returns true value is required (should be defined).
 * @param val Verified value.
 * @param condition Condition represented by function (returns true/false).
 * @param error Error text or object.
 */
export function required(val: any, condition: () => boolean, error: string | ValueValidationError): any;

export function required(val: any, condition: (() => boolean) | null = null, error: string | ValueValidationError| null = null): any {
    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }
    if (val === undefined || val === null || (typeof val === 'string' && !val)) {
        return Utils.getErrorObject(!!error ? error : CompositeValidationOptions.errorMatch('required'), true);
    }
    return Utils.getWrappedValue(val, true);
}
