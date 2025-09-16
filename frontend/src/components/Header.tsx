import { CheckSquare } from 'lucide-react';

function Header() {
  return (
    <header className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-full">
          <CheckSquare className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">TEN Task Manager</h1>
      </div>
    </header>
  );
}

export default Header;