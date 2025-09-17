import { useCallback, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTasks } from '@/hooks/useTasks';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { SearchBar } from '@/components/SearchBar';
import { PaginationControls } from '@/components/PaginationControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTaskRequest } from '@/types/task';

interface TaskManagerProps {
    currentPage: number;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ currentPage }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialSearchQuery = searchParams.get('q') || '';
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

    const {
        tasks,
        isLoading,
        isOperationLoading,
        pagination,
        createTask,
        searchTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        goToPage,
    } = useTasks(currentPage);

    const handleCreateTask = useCallback(async (title: string, description: string): Promise<void> => {
        const taskData: CreateTaskRequest = { title, description };
        await createTask(taskData);
    }, [createTask]);

    const handleSearch = useCallback((value: string) => {
        searchTask(value);
    }, [searchTask]);

    const handleClear = useCallback(() => {
        navigate('/');
    }, [navigate]);

    const handlePageChange = useCallback(async (page: number): Promise<void> => {
        await goToPage(page);
    }, [goToPage]);

    return (
        <div className="container mx-auto p-4">
            {/* Task Form */}
            <section className="mb-8" aria-label="Create new task">
                <TaskForm onSubmit={handleCreateTask} isLoading={isOperationLoading} />
            </section>
            {/* Search */}
            <section className="mb-6" aria-label="Search and actions">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 w-full">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSearch={handleSearch}
                            onClear={handleClear}
                            placeholder="Search tasks by title or description..."
                        />
                    </div>
                </div>
            </section>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Your Tasks</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <TaskList
                        tasks={tasks}
                        onToggleComplete={toggleTaskCompletion}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        isLoading={isLoading}
                        isOperationLoading={isOperationLoading}
                    />

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="mt-6">
                            <PaginationControls
                                currentPage={pagination.currentPage}
                                totalPages={pagination.totalPages}
                                onPageChange={handlePageChange}
                                isLoading={isLoading || isOperationLoading}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};