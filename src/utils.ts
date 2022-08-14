import { WrappedValue, ValueValidationError } from './types';
import { CompositeValidationOptions } from './validators/composite-validation-options';
import { ValidityStateEnum } from "./validators/validity-state.enum";

/**
 * Validation API helpers.
 */
export class Utils {
    /**
     * Replaces tokens ({0}, {1}, etc.) in message respectively with args values and returns transformed string.
     * @param message Tokenized message.
     * @param args Values for substitution.
     */
    public static evaluateMessage(message: string, args: any[]): string {

        if (!args || !args.length) {
            return message;
        }
    
        const output = message.replace(/\{\$(\d)\}/, match => { 
            const res = /\d+/.exec(match);
            if (!res) {
                return match;
            }         
            const numb = res[0];
            if (!numb) {
                return match;
            }
    
            const parsed = parseInt(numb, 10);
            if (isNaN(parsed)) {
                return match;
            }
    
            if (args[parsed] == null) {
                return match;
            }
            
            return args[parsed] + '';
        });
    
        return output;
    }

    /**
     * Returns instance of error object.
     * @param error Error string or object.
     * @param isRequired Value is required.
     * @param args Values for substitution using token replacer.
     */
    public static getErrorObject<T>(value: T, error: string | ValueValidationError<T>, isRequired = false, args?: any[]): ValueValidationError<T> {
        if (typeof error === 'string') {
            if (args && args.length) {
                error = Utils.evaluateMessage(error, args);
            }
            return new ValueValidationError(value, error, isRequired);
        }

        if (error instanceof ValueValidationError) {
            return error;
        }

        return new ValueValidationError(value, CompositeValidationOptions.errorMatch('invalid'), isRequired);
    }

    /**
     * Returns instance of value wrapper.
     * @param value Inner value.
     * @param isRequired Value is required.
     */
    public static getWrappedValue<T>(value: T, isRequired = false): WrappedValue<T> {
        return new WrappedValue(value, isRequired);
    }

    /**
     * If argument is wrapped value (instance of ValueWrapper) returns inner value.
     * Else returns argument value.
     * @param obj Value wrapper or JS basic type value.
     */
    public static tryGetValue<T>(obj: T | WrappedValue<T>): T {
        return obj instanceof WrappedValue ? obj.value : obj;
    }
}
