import { ValueValidationError } from '../types';
import { Utils } from '../utils';
import { CompositeValidationOptions } from './composite-validation-options';

/**
 * Value should be equal to target.
 * @param val Verified value.
 * @param target Target value.
 */
export function equals(val: any, target: any): any;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Target value.
 * @param condition Condition represented by function (returns true/false).
 */
export function equals(val: any, target: any, condition: () => boolean): any;
/**
 * If condition returns true Value should be equal to target/
 * @param val Verified value.
 * @param target Target value.
 * @param condition Condition represented by function (returns true/false).
 * @param error Error text or object.
 */
export function equals(val: any, target: any, condition: () => boolean, error: string | ValueValidationError): any;

export function equals(val: any, target: any,  condition: (() => boolean) | null = null, error: string | ValueValidationError| null = null): any {
    if (condition && !condition()) {
        return Utils.getWrappedValue(val);
    }
    if (val !== target) {
        return Utils.getErrorObject(!!error ? error : CompositeValidationOptions.errorMatch('equals'), false, [target]);
    }
    return Utils.getWrappedValue(val);
}
