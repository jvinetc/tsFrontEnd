import { useState } from 'react';

type ConfirmOptions = {
    message: string;
    confirmText?: string;
    cancelText?: string;
};
export const useConfirmDialog = () => {
    const [options, setOptions] = useState<ConfirmOptions | null>(null);
    const [toSolve, setToSolve] = useState<(value: boolean) => void>();

    const confirm = (message: string, confirmText = 'Confirmar', cancelText = 'Cancelar'): Promise<boolean> => {
        setOptions({ message, confirmText, cancelText });
        return new Promise((solve) => {
            setToSolve(() => solve);
        });
    }

    const ConfirmDialog = () => {
        if (!options) return null;

        const handleConfirm = () => {
            toSolve?.(true);
            setOptions(null);
        };

        const handleCancel = () => {
            toSolve?.(false);
            setOptions(null);
        }

        return (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80">
                    <p className="text-gray-800 dark:text-white mb-4">{options.message}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded"
                            onClick={handleCancel}
                        >
                            {options.cancelText}
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                            onClick={handleConfirm}
                        >
                            {options.confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return { confirm, ConfirmDialog};
}


