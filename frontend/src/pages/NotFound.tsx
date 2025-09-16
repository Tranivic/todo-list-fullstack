import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="bg-background flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-foreground mb-4">
                    404
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Not Found
                </p>
                <button
                    onClick={handleGoHome}
                    className="flex items-center gap-2"
                >
                    <Home className="h-4 w-4" />
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;