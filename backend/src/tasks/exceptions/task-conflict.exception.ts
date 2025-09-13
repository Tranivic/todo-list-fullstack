import { ConflictException } from '@nestjs/common';

export class TaskConflictException extends ConflictException {
    constructor(message: string) {
        super({
            message,
            error: 'Task Conflict',
            statusCode: 409,
        });
    }
}
