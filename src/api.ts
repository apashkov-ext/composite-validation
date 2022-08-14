import { MixedValidationFunction, VMap, ValidationFunction, ObjectValidator, ValidatedObject, ArrayValidator, WrappedValue } from './types';
import { Utils } from './utils';
import { ValueValidationError } from './types';

/**
 * Sets validity conditions for data model's value.
 * @param vFunctions Conditions represented by one or more validation functions (operators).
 */
export function Conditions<T>(...vFunctions: ValidationFunction<T>[]) {
    return Compose(vFunctions);
}

// export type Flatten<A> = A extends (infer T)[] ? T : never;
export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

/**
 * Applies conditions or validation map for each item of array.
 * @param vFunctions Validity conditions or validation map.
 */
export function Each<T>(rules: (arr: T[]) => MixedValidationFunction<Flatten<T>>): ArrayValidator<T> {
    return function (data: T[], ...args: any[]) {       
        if (!data || !Array.isArray(data) || !data.length) {
            return {};
        }

        const output: { [key: string]:  WrappedValue | ValueValidationError; } = {};
        var functions = rules(data);        
        const validator = Compose(functions);     
        const length = data.length;

        for (let i = 0; i < length; i++) {
            output[`item${i}`] = validator(data[i] || undefined, ...[data, ...args]);
        }

        return output;
    };
}

/**
 * Creates validation map for data model.
 * @param rules Validation map definition.
 */
export function ValidationMap<T>(rules: (model: Partial<T>) => VMap<Partial<T>>): ObjectValidator<T> {
    return function <K extends keyof T>(data: Partial<T>, ...args: any[]) {
        const output: ValidatedObject<T> = {};
        var map = rules(data);
        const keys = Object.keys(map).map(m => m as K);
        const length = keys.length;

        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const validator = Compose(map[key]);
            const val = data && data[key] 
            output[key] = validator(val || undefined, ...[data, ...args]);
        }

        return output;
    };
}

function Compose<T>(vf: MixedValidationFunction<T>): any {
    if (!Array.isArray(vf)) { 
        // if (vf && typeof vf === 'object') {
        //     return ValidationMap<T>(() => vf);
        // }
        if (vf && typeof vf === 'function') {
            return vf;
        }
        throw new Error('Неверно задано условие.');
    }

    const mapped = vf.map(m => Compose(m));
    return function (value: any, ...args: any[]) {      
        if (!mapped.length) {
            return Utils.getWrappedValue(value, false);
        }

        let isRequired = false;
        let res = value;
        for (let i = 0; i < mapped.length; ++i) {
            res = mapped[i](Utils.tryGetValue(res), ...args);
            if (res instanceof ValueValidationError) {
                break;
            }
            if (!isRequired && res && res.isRequired === true) {
                isRequired = true;
            }
        }

        if (isRequired) {
            res.isRequired = true;
        }

        return res;
    };
}
