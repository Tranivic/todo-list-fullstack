import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { TaskFormData } from '@/types/task';

interface TaskFormProps {
    readonly onSubmit: (title: string, description: string) => Promise<void>;
    readonly isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, isLoading = false }) => {
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
    });

    const handleTitleChange = useCallback((value: string): void => {
        setFormData(prev => ({ ...prev, title: value }));
    }, []);

    const handleDescriptionChange = useCallback((value: string): void => {
        setFormData(prev => ({ ...prev, description: value }));
    }, []);

    const resetForm = useCallback((): void => {
        setFormData({ title: '', description: '' });
    }, []);

    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        const trimmedTitle = formData.title.trim();
        const trimmedDescription = formData.description.trim();

        if (!trimmedTitle) return;

        await onSubmit(trimmedTitle, trimmedDescription);
        resetForm();
    }, [formData, onSubmit, resetForm]);

    const isSubmitDisabled = !formData.title.trim() || isLoading;

    return (
        <Card className="shadow-md border rounded-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Plus className="h-5 w-5 text-gray-600" />
                    Add New Task
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter task title..."
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            required
                            maxLength={200}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleDescriptionChange(e.target.value)}
                            placeholder="Enter task description (optional)..."
                            rows={3}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            maxLength={1000}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isLoading ? 'Adding...' : 'Add Task'}
                    </button>
                </form>
            </CardContent>
        </Card>
    );
};
