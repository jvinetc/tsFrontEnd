import { Link } from "react-router-dom";
import type { IStop } from "../interface/Stop";
import { BiEditAlt, BiTrashAlt } from "react-icons/bi";
type CardProps = {
    stop: IStop;
    isActive: boolean;
    onSelect: () => void;
    onDelete: (value: IStop) => void;
    changeStatus: ({ stop, status }: { stop: IStop, status: string }) => void;
}
const StopCard = ({ stop, isActive, onSelect, onDelete, changeStatus }: CardProps) => (
    <div
        onClick={onSelect}
        className={`rounded-lg shadow border grid grid-cols-1 md:grid-cols-2 gap-4 p-4 cursor-pointer transition-colors ${isActive
                ? 'bg-beige dark:bg-beige-800 border-blue-300 dark:border-blue-500'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
    >
        {/* Información del stop */}
        <div className="space-y-3">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{stop.addresName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                {stop.addres}, {stop.Comuna?.name}
            </p>
            {stop.status === 'pickUp'  && <p className="text-sm text-gray-600 dark:text-gray-300">
                {`Retirar: ${stop.Sell?.addresPickup}, ${stop.Sell?.Comuna?.name}`}
            </p>}
            <p className="text-sm text-gray-600 dark:text-gray-300">📞 {stop.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">🛒 {stop.Sell?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Estado: {stop.status}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Fragil: {stop.fragile ? 'Sí' : 'No'} | Devolución: {stop.devolution ? 'Sí' : 'No'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Conductor:{' '}
                {stop.Driver
                    ? `${stop.Driver.User?.firstName} ${stop.Driver.User?.lastName}`
                    : 'No asignado'}
            </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-col items-end justify-between space-y-3">
            {stop.status !== 'delivery' && stop.status !== 'delivered' && (
                <div className="flex flex-col items-end space-y-2">
                    <button
                        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(stop);
                        }}
                    >
                        <BiTrashAlt /> Eliminar
                    </button>
                    <Link
                        to={`/stops/edit/${stop.id}`}
                        className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <BiEditAlt /> Editar
                    </Link>
                </div>
            )}

            {stop.status === 'pickUp' && (
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 dark:text-gray-200 font-medium">¿Retirado?</label>
                    <input
                        type="checkbox"
                        checked={false}
                        onChange={() => changeStatus({ stop, status: 'delivery' })}
                        className="toggle-checkbox"
                    />
                </div>
            )}

            {stop.status === 'delivery' && (
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg shadow px-3 py-2">
                    <label className="text-sm text-gray-700 dark:text-gray-200 font-medium">¿Entregado?</label>
                    <input
                        type="checkbox"
                        checked={false}
                        onChange={() => changeStatus({ stop, status: 'delivered' })}
                        className="toggle-checkbox"
                    />
                </div>
            )}
        </div>
    </div>
);

export default StopCard;