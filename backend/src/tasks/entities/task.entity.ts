import { randomUUID } from 'crypto';
import { TaskResponseDto } from '../dto/responses/task-response.dto';

export class Task {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(title: string, description?: string) {
        this.id = randomUUID();
        this.title = title;
        this.description = description;
        this.isCompleted = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    update(updateData: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
        Object.assign(this, { ...updateData, updatedAt: new Date() });
    }

    toResponseDto(): TaskResponseDto {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isCompleted: this.isCompleted,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
