import { RuleMap, ObjectValidator, ValidatedObject, ArrayValidator, MixedValidator, ValueValidator, Flatten, ValidatedArray, ValidatedValue, ObjectType } from './types';
import { Utils } from './utils';
import { ValueValidationError } from './types';

/**
 * Describes and composes a validity rule with a single or multiple operators.
 * @param rules Conditions represented by one or more validation functions (operators).
 */
export function rules<T>(...operators: ValueValidator<T>[]): ValueValidator<T> {
    return Compose(operators) as ValueValidator<T>;
}

/**
 * Applies rules to each element of the array.
 * @param rules Validity rules described by the value validator.
 */
export function each<T extends readonly unknown[]>(rules: (arr: T) => ValueValidator<Flatten<T>>): ArrayValidator<T>;
/**
 * Applies rules to each element of the array.
 * @param rules Validity rules described by the object validator.
 */
export function each<T extends readonly unknown[]>(rules: (arr: T) => ObjectValidator<Flatten<T>>): ArrayValidator<T>;
export function each<T extends readonly unknown[]>(rules: (arr: T) => ValueValidator<Flatten<T>> | ObjectValidator<Flatten<T>>): ArrayValidator<T> {
    return function (data: T, ...args: any[]) {       
        if (!data || !Array.isArray(data) || !data.length) {
            return {};
        }

        const output: ValidatedArray<T> = {};
        var functions = rules(data);        
        const validator = Compose(functions);     
        const length = data.length;

        for (let i = 0; i < length; i++) {
            output[`item${i}`] = validator(data[i] || undefined, ...[data, ...args]) as any;
        }

        return output;
    };
}

export function ruleMap<T extends ObjectType<T>>(rules: RuleMap<Partial<T>>): ObjectValidator<T>;
export function ruleMap<T extends ObjectType<T>>(rules: (model: Partial<T>) => RuleMap<Partial<T>>): ObjectValidator<T>;
/**
 * Creates validation map for data model.
 * @param rules Validation map definition.
 */
export function ruleMap<T extends ObjectType<T>>(rules: RuleMap<Partial<T>> | ((model: Partial<T>) => RuleMap<Partial<T>>)): ObjectValidator<T> {
    return function <K extends keyof T>(data: Partial<T>, ...args: any[]): ValidatedObject<T> {
        const output: Partial<ValidatedObject<T>> = {};
        var map = getMapValue(rules, data);
        const keys = Object.keys(map).map(m => m as K);
        const length = keys.length;

        for (let i = 0; i < length; i++) {
            const key = keys[i];
            const validator = Compose(map[key]);
            const val = data && data[key] 
            output[key] = validator(val || undefined, ...[data, ...args]);
        }

        return output as ValidatedObject<T>;
    };
}

function getMapValue<T>(rules: RuleMap<Partial<T>> | ((model: Partial<T>) => RuleMap<Partial<T>>), model: Partial<T>): RuleMap<Partial<T>> {
    if (rules != null && typeof rules === 'function') return rules(model);
    if (typeof rules === 'object') return rules;
    throw new Error('Incorrect validation rules definition')
}

function Compose<T>(vf: MixedValidator<T> | ValueValidator<T>[]): MixedValidator<T> {
    if (!Array.isArray(vf)) { 
        if (vf && typeof vf === 'object') {
            return ruleMap<T>(() => vf);
        }
        if (vf && typeof vf === 'function') {
            return vf;
        }
        throw new Error('Incorrect validation rule definition');
    }

    const mapped = vf.map(m => Compose(m));
    return function (value: T, ...args: any[]): ValidatedValue<T> {      
        if (!mapped.length) {
            return Utils.getWrappedValue(value, false);
        }

        let isRequired = false;
        let res: any = value;
        for (let i = 0; i < mapped.length; ++i) {
            res = mapped[i](Utils.tryGetValue(res), ...args);
            if (res instanceof ValueValidationError) {
                break;
            }
            isRequired = !isRequired && res && res.isRequired === true;     
        }

        if (isRequired) {
            res.isRequired = true;
        }

        return res;
    };
}
