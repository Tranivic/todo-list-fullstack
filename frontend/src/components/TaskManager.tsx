import { useMemo, useCallback } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskList } from '@/components/TaskList';
import { PaginationControls } from '@/components/PaginationControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TaskManagerProps {
  currentPage: number;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ currentPage }) => {
    const {
        tasks,
        isLoading,
        isOperationLoading,
        error,
        pagination,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        goToPage,
        refetch,
    } = useTasks(currentPage);

    const handlePageChange = useCallback(async (page: number): Promise<void> => {
        await goToPage(page);
    }, [goToPage]);

    return (
        <div className="container mx-auto p-4">
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