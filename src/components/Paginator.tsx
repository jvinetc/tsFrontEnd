import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

interface PaginatorProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    count: number;
}
const Paginator = ({ currentPage, totalPages, onPageChange, count }: PaginatorProps) => {
    const pages = Math.ceil(count / totalPages);
    const items = [];
    for (let i = 1; i <= pages; i++) {
        items.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-600 ${i === currentPage
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600'
                    }`}
            >
                {i}
            </button>
        );
    }
    const handleNext = () => {
        onPageChange(currentPage + 1);
    }
    const handlePrev = () => {
        onPageChange(currentPage - 1);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-4">
            {/* ← Botón anterior */}
            {currentPage < 1 && <button
                onClick={() => handlePrev}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 disabled:opacity-50"
            >
                <FaChevronLeft />
            </button>}

            {/* Números de página */}
            {items}

            {/* → Botón siguiente */}
            {currentPage > pages && <button
                onClick={() => handleNext}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600 disabled:opacity-50"
            >
                <FaChevronRight />
            </button>}
        </div>
    );
}

export default Paginator