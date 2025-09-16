import { TaskContainer } from "@/components/TaskContainer"

const Index: React.FC = () => {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Tasks */}
                <main>
                    <TaskContainer />
                </main>
            </div>
        </div>
    );
};

export default Index;
