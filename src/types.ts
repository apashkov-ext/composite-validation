export class ValidatedValue2<t> {

}

export type ObjectType<T> = {  [K in keyof T]: T[K]; };
/**
 * Validation map for data model.
 */
export type RuleMap<T> = { [K in keyof T]: MixedValidator<T[K]>; }
/**
 * Wrapper for basic JavaScript type.
 */
export class WrappedValue<T> {
    /**
     * Creates instance of wrapper.
     * @param value Current value.
     * @param isRequired Value is required.
     */
    constructor(public value: T, public isRequired: boolean) {}
}
/**
 * Data model's value validation error.
 */
export class ValueValidationError<T> {
    /**
     * Creates instance of error's object.
     * @param value Current value.
     * @param error Error message.
     * @param isRequired Value is required.
     */
    constructor(public value: T, public error: string, public isRequired = false) {}
}

export type ValueValidator<T> = (data: T, ...args: any[]) => ValidatedValue<T>;
export type ValidatedValue<T> = WrappedValue<T> | ValueValidationError<T>;

export type ObjectValidator<T> = (data: Partial<T>, ...args: any[]) => ValidatedObject<T>;
export type ValidatedObject<T> = { [K in keyof T]: ValidatedValue<T[K]> | ValidatedObject<T[K]> | ValidatedArray<T[K]>; }

export type ArrayValidator<T> = (data: T, ...args: any[]) => ValidatedArray<T>;
export type ValidatedArray<T> = { [key: string]:  ValidatedValue<Flatten<T>> | ValidatedObject<Flatten<T>>; }

export type MixedValidator<T> = ValueValidator<T> | ArrayValidator<T> | ObjectValidator<T>

export type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
