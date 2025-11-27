import type { APIError, ValidationError } from "../types/ErrorFallbackType";

export const getErrorMessage = (error: APIError | null | undefined): string => {
    if (!error) return "";

    if ('errors' in error && (error as ValidationError).errors) {
        const validationError = error as ValidationError;

        const firstKey = Object.keys(validationError.errors)[0]
        if(firstKey) {
            return validationError.errors[firstKey]
        }
    }

    const fallbackMsg = "Server Error"
    return error.message || fallbackMsg
}