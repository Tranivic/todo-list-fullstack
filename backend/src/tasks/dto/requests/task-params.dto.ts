import { IsUUID } from 'class-validator';

export class TaskParamsDto {
    @IsUUID(4)
    id: string;
}
