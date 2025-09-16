import { Task } from '@/types/task';
import { TaskItem } from './TaskItem';
import { CheckCircle } from 'lucide-react';

interface TaskListProps {
    readonly tasks: Task[];
    readonly onToggleComplete: (id: string) => Promise<void>;
    readonly onUpdate: (id: string, title: string, description: string, isCompleted: boolean) => Promise<void>;
    readonly onDelete: (id: string) => Promise<void>;
    readonly isLoading?: boolean;
    readonly isOperationLoading?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggleComplete,
    onUpdate,
    onDelete,
    isLoading = false,
    isOperationLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-muted rounded mt-1"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    No tasks yet
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Create your first task to get started with your productivity journey.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3" role="list" aria-label="Tasks">
            {tasks.map((task) => (
                <div key={task.id} className="group" role="listitem">
                    <TaskItem
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                        isOperationLoading={isOperationLoading}
                    />
                </div>
            ))}
        </div>
    );
};