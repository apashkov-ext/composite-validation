/**
 * Data model's value validity state.
 */
export class ValueState {
    /**
     * Creates instance of value state.
     * @param name Name of value.
     * @param valid Value is valid.
     * @param error Error message.
     * @param error Value is required.
     */
    constructor(public name?: string, 
        public valid?: boolean, 
        public error?: string, 
        public isRequired?: boolean) { }
}
/**
 * Basic JavaScript type.
 */
export type SimpleType = number | string | boolean;
export type ObjectType = { [key: string]: any; };
/**
 * Validation function. 
 */
export type ValidationFunction = (data: any, ...args: any[]) => any;
/**
 * Mixed validation function.
 */
export type MixedValidationFunction = ValidationFunction | Array<ValidationFunction> | VMap;
/**
 * Validation map for data model.
 */
export type VMap<T> = { [Property in keyof T]: MixedValidationFunction; }
/**
 * Wrapper for basic JavaScript type.
 */
export class WrappedValue {
    /**
     * Creates instance of wrapper.
     * @param value Inner wrapper value.
     * @param isRequired Value is required.
     */
    constructor(public value: SimpleType | ObjectType, public isRequired: boolean) {}
}
/**
 * Data model's value validation error.
 */
export class ValueValidationError {
    /**
     * Creates instance of error's object.
     * @param error Error message.
     * @param isRequired Value is required.
     */
    constructor(public error: string, public isRequired = false) {}
}
