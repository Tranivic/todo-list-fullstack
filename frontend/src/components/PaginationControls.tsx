import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

interface PaginationControlsProps {
    totalPages: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
    isLoading?: boolean;
    basePath?: string;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    totalPages,
    currentPage,
    onPageChange,
    isLoading = false,
    basePath = '/tasks',
}) => {
    if (totalPages <= 1) return null;

    const navigate = useNavigate();
    const params = useParams<{ page?: string }>();

    const effectiveCurrentPage = useMemo(() => {
        const fromUrl = params.page ? parseInt(params.page, 10) : NaN;
        if (!Number.isNaN(fromUrl) && fromUrl >= 1) return Math.min(fromUrl, totalPages);
        if (typeof currentPage === 'number' && currentPage >= 1) return Math.min(currentPage, totalPages);
        return 1;
    }, [params.page, currentPage, totalPages]);

    const safeNavigateTo = useCallback(
        (page: number) => {
            if (isLoading) return;
            const clamped = Math.max(1, Math.min(page, totalPages));

            onPageChange?.(clamped);
            navigate(`${basePath}/${clamped}`);
        },
        [isLoading, totalPages, onPageChange, navigate, basePath]
    );

    const generatePageNumbers = useCallback((): (number | 'ellipsis')[] => {
        const pages: (number | 'ellipsis')[] = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        pages.push(1);

        if (effectiveCurrentPage > 3) {
            pages.push('ellipsis');
        }

        const start = Math.max(2, effectiveCurrentPage - 1);
        const end = Math.min(totalPages - 1, effectiveCurrentPage + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (effectiveCurrentPage < totalPages - 2) {
            pages.push('ellipsis');
        }

        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    }, [effectiveCurrentPage, totalPages]);

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => safeNavigateTo(effectiveCurrentPage - 1)}
                disabled={effectiveCurrentPage === 1 || isLoading}
            >
                <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) =>
                    page === 'ellipsis' ? (
                        <div key={`ellipsis-${index}`} className="px-2">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                    ) : (
                        <button
                            key={page}
                            onClick={() => safeNavigateTo(page)}
                            disabled={isLoading}
                            className={`w-10 h-10 ${page === effectiveCurrentPage ? 'font-semibold underline' : ''
                                }`}
                            aria-current={page === effectiveCurrentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() => safeNavigateTo(effectiveCurrentPage + 1)}
                disabled={effectiveCurrentPage === totalPages || isLoading}
            >
                <ChevronRight className="h-4 w-4" />
            </button>
        </div>
    );
};