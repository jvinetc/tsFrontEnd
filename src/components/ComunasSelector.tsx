import { useState } from "react";
import type { IComuna } from "../interface/Comuna";
import type { IDriver } from "../interface/Driver";

type propsSelector = {
    comunas: IComuna[] | null;
    driver: IDriver | null;
    setDriver: (driver: IDriver | null) => void
}
export default function ComunasSelector({ comunas, driver, setDriver }: propsSelector) {
    const [selectedComunas, setSelectedComunas] = useState(driver?.Comunas || []);
    console.log(driver); 
    const handleSelect = (comuna: IComuna) => {
        if (!selectedComunas.some((c) => c.id === comuna.id)) {
            const updated = [...selectedComunas, comuna];
            setSelectedComunas(updated);
            setDriver({ ...driver, Comunas: updated });

            // Simular envío al servidor
            /* fetch("/api/driver/comunas", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ comunas: updated.map((c) => c.id) }),
            }); */
        }
    };

    const handleRemove = (id: number) => {
        const updated = selectedComunas.filter((c) => c.id !== id);
        setSelectedComunas(updated);
        setDriver({ ...driver, Comunas: updated });

        // Simular eliminación en el servidor
        /* fetch("/api/driver/comunas", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comunaId: id }),
        }); */
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">
                Comunas que cubre
            </h3>

            {/* Lista scrolleable de comunas disponibles */}
            <div className="max-h-40 overflow-y-auto border rounded p-2 bg-white dark:bg-gray-800">
                {comunas && comunas.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        className="block w-full text-left px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 text-gray-800 dark:text-gray-200"
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {/* Lista de comunas seleccionadas */}
            {selectedComunas.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-md font-medium text-gray-600 dark:text-gray-400">
                        Seleccionadas
                    </h4>
                    <ul className="space-y-1">
                        {selectedComunas.map((c) => (
                            <li
                                key={c.id}
                                className="flex justify-between items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded"
                            >
                                <span className="text-gray-800 dark:text-gray-200">{c.name}</span>
                                <button
                                    onClick={() => handleRemove(Number(c.id))}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}