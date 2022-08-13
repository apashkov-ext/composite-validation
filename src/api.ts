import { MixedValidationFunction, VMap, ValidationFunction, ObjectType } from './types';
import { Utils } from './utils';
import { ValueValidationError } from './types';

/**
 * Sets validity conditions for data model's value.
 * @param vFunctions Conditions represented by one or more validation functions (operators).
 */
export function Conditions(...vFunctions: ValidationFunction[]) {
    return ComposeFunctions(vFunctions);
}

/**
 * Applies conditions or validation map for each item of array.
 * @param vFunctions Validity conditions or validation map.
 */
export function Each(vFunctions: MixedValidationFunction) {
    return function (data: any, ...args: any[]) {       
        if (!data || !Array.isArray(data) || !data.length) {
            return {};
        }

        const output: { [x: string]: any; } = {};           
        const validator = ComposeFunctions(vFunctions);     
        const length = data.length;

        for (let i = 0; i < length; i++) {
            output[`item${i}`] = validator(data[i] || undefined, ...[data, ...args]);
        }

        return output;
    };
}

/**
 * Creates validation map for data model.
 * @param vmap Validation map definition.
 */
export function ValidationMap<T>(vMap: (v: T) => VMap<T>) {
    return function (data: ObjectType, ...args: any[]) {
        const output: { [x: string]: any; } = {};
        const keys = Object.keys(vMap);
        const length = keys.length;

        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const validator = ComposeFunctions(vMap[key]);
            const v = data && data[key] 
            output[key] = validator(v || undefined, ...[data, ...args]);
        }

        return output;
    };
}

function ComposeFunctions(vf: MixedValidationFunction = (v) => v): any {
    if (!Array.isArray(vf)) { 
        if (vf && typeof vf === 'object') {
            return ValidationMap(vf);
        }
        if (vf && typeof vf === 'function') {
            return vf;
        }
        throw new Error('Неверно задано условие.');
    }

    const mapped = vf.map(m => ComposeFunctions(m));
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
