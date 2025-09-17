import {
    Task,
    CreateTaskRequest,
    UpdateTaskRequest,
    TasksResponse,
    PaginationParams,
} from '@/types/task';

const API_BASE_URL = 'http://localhost:3000/api/tasks';

class TaskApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'TaskApiError';
    }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const errorMessage = `API Error: ${response.status} ${response.statusText}`;
        throw new TaskApiError(errorMessage, response.status);
    }

    try {
        const returningResponse = await response.json();
        if (returningResponse.data) {
            if (returningResponse.data.items) {
                return returningResponse;
            } else {
                return returningResponse.data as T;
            }
        } else {
            return returningResponse as T;
        }
    } catch (error) {
        throw new TaskApiError('Failed to parse API response');
    }
};

export const taskService = {
    async getTasks(params: PaginationParams & { searchQuery?: string } = { page: 1, limit: 10 }): Promise<TasksResponse> {
        const url = new URL(API_BASE_URL);
        url.searchParams.set('page', params.page.toString());
        url.searchParams.set('limit', params.limit.toString());
        
        if (params.searchQuery && params.searchQuery.trim()) {
            url.searchParams.set('search', params.searchQuery.trim());
        }

        const response = await fetch(url.toString());
        return handleApiResponse<TasksResponse>(response);
    },

    async createTask(task: CreateTaskRequest): Promise<Task> {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });

        return handleApiResponse<Task>(response);
    },

    async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
        const response = await fetch(`${API_BASE_URL}/${id}/edit`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        return handleApiResponse<Task>(response);
    },

    async toggleTaskCompletion(id: string): Promise<Task> {
        const response = await fetch(`${API_BASE_URL}/${id}/done`, {
            method: 'PATCH',
        });

        return handleApiResponse<Task>(response);
    },

    async deleteTask(id: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new TaskApiError(`Failed to delete task: ${response.status}`, response.status);
        }
    },
};