import { useCallback } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    readonly value: string;
    readonly onSearch?: (value: string) => void;
    readonly onChange?: (value: string) => void;
    readonly onClear?: () => void;
    readonly placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onSearch,
    onChange,
    onClear,
    placeholder = "Search tasks..."
}) => {
    const handleSearch = useCallback((): void => {
        if (onSearch) {
            onSearch(value);
        }
    }, [onSearch, value]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
        if (onChange) {
            onChange(e.target.value);
        }
    }, [onChange]);

    const handleClear = useCallback((): void => {
        if (onChange) {
            onChange('');
        }
        if (onClear) {
            onClear();
        }
    }, [onChange, onClear]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }, [handleSearch]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
                value={value}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="w-full h-10 pl-10 pr-20 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                maxLength={100}
            />

            {value && (
                <button
                    onClick={handleClear}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-full hover:bg-muted transition-colors duration-200 flex items-center justify-center"
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
            <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center shadow-sm"
                aria-label="Search"
            >
                <Search className="h-4 w-4" />
            </button>
        </div>
    );
};