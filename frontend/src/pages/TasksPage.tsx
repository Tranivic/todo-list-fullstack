import { useParams } from 'react-router-dom';
import { TaskManager } from "@/components/TaskManager";

const TasksPage: React.FC = () => {
    const { page } = useParams<{ page: string }>();
    
    const currentPage = parseInt(page);
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Tasks */}
                <main>
                    <TaskManager currentPage={currentPage} />
                </main>
            </div>
        </div>
    );
};

export default TasksPage;