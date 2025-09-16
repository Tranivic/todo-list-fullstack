import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { TaskManager } from "@/components/TaskManager";

const TasksPage: React.FC = () => {
    const { page } = useParams<{ page: string }>();
    const navigate = useNavigate();
    
    const currentPage = parseInt(page);
    
    useEffect(() => {
        if (isNaN(currentPage) || currentPage < 1) {
            navigate('/404', { replace: true });
        }
    }, [currentPage, navigate]);
    
    if (isNaN(currentPage) || currentPage < 1) {
        return null;
    }
    
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