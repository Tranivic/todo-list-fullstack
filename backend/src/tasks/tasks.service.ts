import {
    Injectable,
    Logger,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { UpdateTaskDto } from './dto/requests/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskNotFoundException } from './exceptions/task-not-found.exception';
import { TaskResponseDto } from './dto/responses/task-response.dto';
import { PaginatedResponseDto } from './dto/responses/paginated-response.dto';

@Injectable()
export class TasksService {
    private readonly logger = new Logger(TasksService.name);
    private tasks: Task[] = [];

    async create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
        try {
            this.logger.log(
                `Creating new task with title: ${createTaskDto.title}`,
            );

            const task = new Task(
                createTaskDto.title,
                createTaskDto.description,
            );
            this.tasks.push(task);

            this.logger.log(`Task created successfully with ID: ${task.id}`);
            return task.toResponseDto();
        } catch (error) {
            this.logger.error(
                `Failed to create task: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException('Failed to create task');
        }
    }

    async findAll(
        page: number = 1,
        limit: number = 10,
    ): Promise<PaginatedResponseDto<TaskResponseDto>> {
        try {
            this.logger.log(`Fetching tasks - Page: ${page}, Limit: ${limit}`);

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const totalPages = Math.ceil(this.tasks.length / limit);
            const paginatedTasks = this.tasks.slice(startIndex, endIndex);

            return {
                items: paginatedTasks.map((task) => task.toResponseDto()),
                total: this.tasks.length,
                page,
                limit,
                totalPages,
            };
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(
                `Failed to fetch tasks: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException('Failed to fetch tasks');
        }
    }

    async update(
        id: string,
        updateTaskDto: UpdateTaskDto,
    ): Promise<TaskResponseDto> {
        try {
            this.logger.log(`Updating task with ID: ${id}`);

            const task = this.tasks.find((task) => task.id === id);
            if (!task) {
                throw new TaskNotFoundException(id);
            }

            task.update(updateTaskDto);

            this.logger.log(`Task ${id} updated successfully`);
            return task.toResponseDto();
        } catch (error) {
            if (error instanceof TaskNotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to update task ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException('Failed to update task');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            this.logger.log(`Removing task with ID: ${id}`);

            const taskIndex = this.tasks.findIndex((task) => task.id === id);
            if (taskIndex === -1) {
                throw new TaskNotFoundException(id);
            }

            this.tasks.splice(taskIndex, 1);
            this.logger.log(`Task ${id} removed successfully`);
        } catch (error) {
            if (error instanceof TaskNotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to remove task ${id}: ${error.message}`,
                error.stack,
            );
            throw new InternalServerErrorException('Failed to remove task');
        }
    }
}
