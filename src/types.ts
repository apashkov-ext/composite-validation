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
export type ObjectType<T> = {  [K in keyof T]: T[K]; };
/**
 * Validation function. 
 */
export type ValidationFunction<T> = (data: T, ...args: any[]) => any;
/**
 * Mixed validation function.
 */
export type MixedValidationFunction<T> = ValidationFunction<T> | Array<ValidationFunction<T>> | VMap<T>;
/**
 * Validation map for data model.
 */
export type VMap<T> = { [K in keyof T]: MixedValidationFunction<T[K]>; }
/**
 * Wrapper for basic JavaScript type.
 */
export class WrappedValue {
    /**
     * Creates instance of wrapper.
     * @param value Inner wrapper value.
     * @param isRequired Value is required.
     */
    constructor(public value: SimpleType | ObjectType<any>, public isRequired: boolean) {}
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

export type ObjectValidator<T> = (data: Partial<T>, ...args: any[]) => ValidatedObject<T>;
export type ValidatedObject<T> = Partial<{ [K in keyof T]: WrappedValue | ValueValidationError; }>

export type ArrayValidator<T> = (data: T[], ...args: any[]) => { [key: string]:  WrappedValue | ValueValidationError; }