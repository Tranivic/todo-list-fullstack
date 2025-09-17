export type Items = Task[];

export interface TasksData {
    items: Items;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TasksResponse {
    data: TasksData;
}

export interface Task {
    readonly id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    readonly createdAt: string;
    readonly updatedAt: string;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    isCompleted: boolean;
}

export interface TasksResponse {
    data: TasksData;
    total: number;
    page: number;
    limit: number;
}

export interface PaginationParams {
    page: number;
    limit: number;
    searchQuery?: string;
}

export interface ApiError {
    message: string;
    status?: number;
}

export interface TaskFormData {
    title: string;
    description: string;
}

export interface EditingTask {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export type TaskAction =
    | { type: 'SET_TASKS'; payload: Task[] }
    | { type: 'ADD_TASK'; payload: Task }
    | { type: 'UPDATE_TASK'; payload: Task }
    | { type: 'DELETE_TASK'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };