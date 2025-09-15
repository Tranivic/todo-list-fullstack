import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { UpdateTaskDto } from './dto/requests/update-task.dto';
import { TaskParamsDto } from './dto/requests/task-params.dto';
import { PaginationQueryDto } from './dto/requests/pagination-query.dto';
import { TaskResponseDto } from './dto/responses/task-response.dto';
import { ApiResponseDto } from './dto/responses/api-response.dto';
import { PaginatedResponseDto } from './dto/responses/paginated-response.dto';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@Controller('tasks')
@UseInterceptors(ResponseInterceptor)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query() query: PaginationQueryDto,
    ): Promise<ApiResponseDto<PaginatedResponseDto<TaskResponseDto>>> {
        const result = await this.tasksService.findAll(query.page, query.limit);
        return new ApiResponseDto(true, 'Tasks fetched successfully', result);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(
        @Body() createTaskDto: CreateTaskDto,
    ): Promise<ApiResponseDto<TaskResponseDto>> {
        const task = await this.tasksService.create(createTaskDto);
        return new ApiResponseDto(true, 'Task created successfully', task);
    }

    @Patch(':id/edit')
    @HttpCode(HttpStatus.OK)
    async update(
        @Param() params: TaskParamsDto,
        @Body() updateTaskDto: UpdateTaskDto,
    ): Promise<ApiResponseDto<TaskResponseDto>> {
        const task = await this.tasksService.update(params.id, updateTaskDto);
        return new ApiResponseDto(true, 'Task updated successfully', task);
    }

    @Patch(':id/done')
    @HttpCode(HttpStatus.OK)
    async markAsDone(@Param() params: TaskParamsDto): Promise<ApiResponseDto<TaskResponseDto>> {
        const task = await this.tasksService.update(params.id, { isCompleted: true });
        return new ApiResponseDto(true, 'Task marked as completed', task);
    }

    @Delete(':id')
    async remove(@Param() params: TaskParamsDto): Promise<{ message: string }> {
        await this.tasksService.remove(params.id);
        return { message: 'Task deleted successfully' };
    }
}
