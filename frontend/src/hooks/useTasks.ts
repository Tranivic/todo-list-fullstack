import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, CreateTaskRequest, PaginationParams, TasksResponse } from '@/types/task';
import { taskService } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';

interface UseTasksState {
    tasks: Task[];
    isLoading: boolean;
    isOperationLoading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalTasks: number;
        limit: number;
    };
}

interface UseTasksReturn extends UseTasksState {
    createTask: (taskData: CreateTaskRequest) => Promise<void>;
    updateTask: (id: string, title: string, description: string, isCompleted: boolean) => Promise<void>;
    toggleTaskCompletion: (id: string) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    goToPage: (page: number) => Promise<void>;
    refetch: () => Promise<void>;
}

const ITEMS_PER_PAGE = 10;

export const useTasks = (initialPage: number): UseTasksReturn => {
    const navigate = useNavigate();
    const [state, setState] = useState<UseTasksState>({
        tasks: [],
        isLoading: false,
        isOperationLoading: false,
        error: null,
        pagination: {
            currentPage: initialPage,
            totalPages: 1,
            totalTasks: 0,
            limit: ITEMS_PER_PAGE,
        },
    });

    const { toast } = useToast();

    const setLoading = useCallback((isLoading: boolean): void => {
        setState(prev => ({ ...prev, isLoading }));
    }, []);

    const setOperationLoading = useCallback((isOperationLoading: boolean): void => {
        setState(prev => ({ ...prev, isOperationLoading }));
    }, []);

    const setError = useCallback((error: string | null): void => {
        setState(prev => ({ ...prev, error }));
    }, []);

    const updatePagination = useCallback((response: TasksResponse): void => {
        setState(prev => ({
            ...prev,
            tasks: response.data.items,
            pagination: {
                currentPage: response.data.page,
                totalPages: Math.ceil(response.data.total / response.data.limit),
                totalTasks: response.data.total,
                limit: response.data.limit,
            },
        }));
    }, []);

    const fetchTasks = useCallback(async (params?: PaginationParams): Promise<void> => {
        const paginationParams = params || {
            page: state.pagination.currentPage,
            limit: ITEMS_PER_PAGE,
        };

        setLoading(true);
        setError(null);

        try {
            const response = await taskService.getTasks(paginationParams);
            if(response.data.totalPages > 0 && initialPage > response.data.totalPages){
                navigate('/')
            }
            updatePagination(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [state.pagination.currentPage, setLoading, setError, toast, updatePagination]);

    const createTask = useCallback(async (taskData: CreateTaskRequest): Promise<void> => {
        if (!taskData.title.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Task title is required',
                variant: 'destructive',
            });
            return;
        }

        setOperationLoading(true);

        try {
            await taskService.createTask(taskData);
            toast({
                title: 'Success',
                description: 'Task created successfully',
            });

            await fetchTasks({ page: initialPage, limit: ITEMS_PER_PAGE });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setOperationLoading(false);
        }
    }, [toast, setOperationLoading, fetchTasks]);

    const updateTask = useCallback(async (id: string, title: string, description: string, isCompleted: boolean): Promise<void> => {
        if (!title.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Task title is required',
                variant: 'destructive',
            });
            return;
        }

        setOperationLoading(true);

        try {
            const updatedTask = await taskService.updateTask(id, { title: title.trim(), description: description.trim(), isCompleted: isCompleted });

            setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(task => task.id === id ? updatedTask : task),
            }));

            toast({
                title: 'Success',
                description: 'Task updated successfully',
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setOperationLoading(false);
        }
    }, [toast, setOperationLoading]);

    const toggleTaskCompletion = useCallback(async (id: string): Promise<void> => {
        setOperationLoading(true);

        try {
            const updatedTask = await taskService.toggleTaskCompletion(id);

            setState(prev => ({
                ...prev,
                tasks: prev.tasks.map(task => task.id === id ? updatedTask : task),
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to toggle task';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setOperationLoading(false);
        }
    }, [toast, setOperationLoading]);

    const deleteTask = useCallback(async (id: string): Promise<void> => {
        setOperationLoading(true);

        try {
            await taskService.deleteTask(id);

            setState(prev => ({
                ...prev,
                tasks: prev.tasks.filter(task => task.id !== id),
                pagination: {
                    ...prev.pagination,
                    totalTasks: prev.pagination.totalTasks - 1,
                },
            }));

            toast({
                title: 'Success',
                description: 'Task deleted successfully',
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setOperationLoading(false);
        }
    }, [toast, setOperationLoading]);

    const goToPage = useCallback(async (page: number): Promise<void> => {
        if (page < 1 || page > state.pagination.totalPages) return;

        await fetchTasks({ page, limit: ITEMS_PER_PAGE });
    }, [state.pagination.totalPages, fetchTasks]);

    const refetch = useCallback((): Promise<void> => {
        return fetchTasks();
    }, [fetchTasks]);

    // Initial fetch
    useEffect(() => {
        fetchTasks({ page: initialPage, limit: ITEMS_PER_PAGE });
    }, []);

    return {
        ...state,
        createTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        goToPage,
        refetch,
    };
};