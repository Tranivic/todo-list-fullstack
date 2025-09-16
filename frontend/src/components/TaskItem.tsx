import { useState, useCallback } from "react";
import { Task, EditingTask } from "@/types/task";
import { Check, Edit2, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
    readonly task: Task;
    readonly onToggleComplete: (id: string) => Promise<void>;
    readonly onUpdate: (
        id: string,
        title: string,
        description: string,
        isCompleted: boolean
    ) => Promise<void>;
    readonly onDelete: (id: string) => Promise<void>;
    readonly isOperationLoading?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggleComplete,
    onUpdate,
    onDelete,
    isOperationLoading = false,
}) => {
    const [editingTask, setEditingTask] = useState<EditingTask | null>(null);

    const isEditing = editingTask?.id === task.id;

    const handleStartEdit = useCallback((): void => {
        setEditingTask({
            id: task.id,
            title: task.title,
            description: task.description,
            isCompleted: task.isCompleted,
        });
    }, [task]);

    const handleSaveEdit = useCallback(async (): Promise<void> => {
        if (!editingTask || !editingTask.title.trim()) return;

        await onUpdate(
            editingTask.id,
            editingTask.title.trim(),
            editingTask.description.trim(),
            editingTask.isCompleted
        );
        setEditingTask(null);
    }, [editingTask, onUpdate]);

    const handleCancelEdit = useCallback((): void => {
        setEditingTask(null);
    }, []);

    const handleTitleChange = useCallback((value: string): void => {
        setEditingTask((prev) => (prev ? { ...prev, title: value } : null));
    }, []);

    const handleDescriptionChange = useCallback((value: string): void => {
        setEditingTask((prev) => (prev ? { ...prev, description: value } : null));
    }, []);

    const handleToggleComplete = useCallback(async (): Promise<void> => {
        await onToggleComplete(task.id);
    }, [onToggleComplete, task.id]);

    const handleDeleteClick = useCallback(async (): Promise<void> => {
        const confirmed = window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`);
        if (confirmed) {
            await onDelete(task.id);
        }
    }, [onDelete, task.id, task.title]);

    if (isEditing && editingTask) {
        return (
            <div className="bg-card border-2 border-primary/20 rounded-lg p-6 shadow-lg ring-1 ring-primary/10 transition-all duration-200">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Title</label>
                        <input
                            value={editingTask.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Task title"
                            className="w-full px-3 py-2 bg-background border border-border rounded-md font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">Description</label>
                        <textarea
                            value={editingTask.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Task description (optional)"
                            rows={3}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={!editingTask.title.trim() || isOperationLoading}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm transition-all duration-200 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20",
                                (!editingTask.title.trim() || isOperationLoading) && "opacity-50 cursor-not-allowed hover:bg-primary"
                            )}
                        >
                            <Check className="h-4 w-4" />
                            {isOperationLoading ? "Saving..." : "Save"}
                        </button>

                        <button
                            onClick={handleCancelEdit}
                            disabled={isOperationLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm transition-all duration-200 hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={cn(
                    "bg-card border border-border rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md group",
                    task.isCompleted && "bg-task-completed-bg opacity-75"
                )}
            >
                <div className="flex items-start gap-3">
                    <button
                        onClick={handleToggleComplete}
                        disabled={isOperationLoading || task.isCompleted}
                        className={cn(
                            "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0",
                            task.isCompleted
                                ? "bg-success border-success text-success-foreground"
                                : "border-muted-foreground hover:border-primary",
                            isOperationLoading && "opacity-50 cursor-not-allowed"
                        )}
                        aria-label={
                            task.isCompleted ? "Mark as incomplete" : "Mark as complete"
                        }
                    >
                        {task.isCompleted && <Check className="h-3 w-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <h3
                            className={cn(
                                "font-medium text-foreground mb-1 break-words",
                                task.isCompleted && "line-through text-task-completed"
                            )}
                        >
                            {task.title}
                        </h3>
                        {task.description && (
                            <p
                                className={cn(
                                    "text-sm text-muted-foreground break-words",
                                    task.isCompleted && "line-through text-task-completed"
                                )}
                            >
                                {task.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        {!task.isCompleted && (
                            <button
                                onClick={handleStartEdit}
                                className="h-8 w-8 p-0 rounded-md hover:bg-muted transition-colors"
                                disabled={isOperationLoading}
                                aria-label="Edit task"
                            >
                                <Edit2 className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            onClick={handleDeleteClick}
                            className="h-8 w-8 p-0 rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                            disabled={isOperationLoading}
                            aria-label="Delete task"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};