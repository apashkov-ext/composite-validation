export class CompositeValidationOptions {
    private static readonly defaultError = 'Value is not valid';
    private static _errorMatches: { [key: string]: string } = {
        required: 'Value should be defined',
        equals: 'Value should be equal to {$0}',
        invalid: CompositeValidationOptions.defaultError
    };

    /**
     * Returns error by key.
     * @param key Error message key.
     */
    public static errorMatch(key: string): string {
        return CompositeValidationOptions._errorMatches[key] || CompositeValidationOptions.defaultError;
    }

    /**
     * Set default errors map.
     * @param value Key value pairs object ('errorKey': 'error Message').
     */
    public static setErrorMatches(value: { [key: string]: string }) {
        CompositeValidationOptions._errorMatches = Object.assign(CompositeValidationOptions._errorMatches, value);
    }
}

