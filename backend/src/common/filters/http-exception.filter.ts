import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../../tasks/dto/responses/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            message =
                typeof exceptionResponse === 'string'
                    ? exceptionResponse
                    : (exceptionResponse as any).message || message;
        }

        this.logger.error(
            `HTTP ${status} Error: ${message}`,
            exception instanceof Error ? exception.stack : 'Unknown error',
        );

        let errorType = 'UnknownError';
        if (exception instanceof HttpException) {
            switch (status) {
                case HttpStatus.NOT_FOUND:
                    errorType = 'NotFoundError';
                    break;
                case HttpStatus.BAD_REQUEST:
                    errorType = 'BadRequestError';
                    break;
                case HttpStatus.UNAUTHORIZED:
                    errorType = 'UnauthorizedError';
                    break;
                case HttpStatus.FORBIDDEN:
                    errorType = 'ForbiddenError';
                    break;
                case HttpStatus.CONFLICT:
                    errorType = 'ConflictError';
                    break;
                case HttpStatus.UNPROCESSABLE_ENTITY:
                    errorType = 'ValidationError';
                    break;
                default:
                    errorType = exception.constructor.name;
            }
        } else if (exception instanceof Error) {
            errorType = exception.constructor.name;
        }

        const errorResponse = new ApiResponseDto(
            false,
            message,
            null,
            errorType,
            request.url,
        );

        response.status(status).json(errorResponse);
    }
}