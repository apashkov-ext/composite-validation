import { WrappedValue, ValueValidationError, SimpleType, ObjectType } from './types';
import { CompositeValidationOptions } from './operators/composite-validation-options';

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
    public static getErrorObject(error: string | ValueValidationError, isRequired = false, args?: any[]): ValueValidationError {
        if (typeof error === 'string') {
            if (args && args.length) {
                error = Utils.evaluateMessage(error, args);
            }
            return new ValueValidationError(error, isRequired);
        }

        if (error instanceof ValueValidationError) {
            return error;
        }

        return new ValueValidationError(CompositeValidationOptions.errorMatch('invalid'), isRequired);
    }

    /**
     * Returns instance of value wrapper.
     * @param value Inner value.
     * @param isRequired Value is required.
     */
    public static getWrappedValue(value: number | string | boolean, isRequired = false): WrappedValue {
        return new WrappedValue(value, isRequired);
    }

    /**
     * If argument is wrapped value (instance of ValueWrapper) returns inner value.
     * Else returns argument value.
     * @param value Value wrapper or JS basic type value.
     */
    public static tryGetValue(obj: WrappedValue | SimpleType | ObjectType): any {
        return obj instanceof WrappedValue ? obj.value : obj;
    }
}
