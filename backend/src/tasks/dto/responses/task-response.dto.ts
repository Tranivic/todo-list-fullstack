export class TaskResponseDto {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
