import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Index";
import TasksPage from "./pages/TasksPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <Toaster />
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <Header />
                            <Index />
                        </>
                    }
                />
                <Route
                    path="/tasks/:page"
                    element={
                        <>
                            <Header />
                            <TasksPage />
                        </>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <>
                            <Header />
                            <TasksPage />
                        </>
                    }
                />
                <Route path="*" element={
                    <>
                        <NotFound />
                    </>
                } />
            </Routes>
        </BrowserRouter>
    </QueryClientProvider>
);

export default App;