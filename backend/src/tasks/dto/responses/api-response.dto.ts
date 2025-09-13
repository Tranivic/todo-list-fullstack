export class ApiResponseDto<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
    path: string;

    constructor(
        success: boolean,
        message: string,
        data?: T,
        error?: string,
        path?: string,
    ) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.error = error;
        this.timestamp = new Date().toISOString();
        this.path = path || '';
    }
}
