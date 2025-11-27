type ErrorsType = Record<any, any>

// usually for error code 422
export interface ValidationError {
    code: number,
    message: string,
    errors: ErrorsType
}

export interface StandarError {
    statusCode: number;
    error: string;
    message: string;
}

export type APIError = ValidationError | StandarError