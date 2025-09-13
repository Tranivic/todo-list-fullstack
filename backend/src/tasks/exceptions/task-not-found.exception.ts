import { NotFoundException } from '@nestjs/common';

export class TaskNotFoundException extends NotFoundException {
    constructor(id: string) {
        super({
            message: `Task with ID '${id}' not found`,
            error: 'Task Not Found',
            statusCode: 404,
        });
    }
}
