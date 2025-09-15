import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/requests/create-task.dto';
import { TaskResponseDto } from './dto/responses/task-response.dto';
import { ApiResponseDto } from './dto/responses/api-response.dto';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    const mockTasksService = {
        create: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
                },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a task successfully and return correct response format', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'Test Task',
                description: 'Test Description',
            };

            const mockTaskResponse: TaskResponseDto = {
                id: '123',
                title: 'Test Task',
                description: 'Test Description',
                isCompleted: false,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-01'),
            };

            mockTasksService.create.mockResolvedValue(mockTaskResponse);

            const result = await controller.create(createTaskDto);

            expect(service.create).toHaveBeenCalledTimes(1);
            expect(service.create).toHaveBeenCalledWith(createTaskDto);

            expect(result).toBeInstanceOf(ApiResponseDto);
            expect(result.success).toBe(true);
            expect(result.message).toBe('Task created successfully');
            expect(result.data).toEqual(mockTaskResponse);
            expect(result.data.id).toBe('123');
            expect(result.data.title).toBe(createTaskDto.title);
            expect(result.data.description).toBe(createTaskDto.description);
            expect(result.data.isCompleted).toBe(false);
        });
    });
});