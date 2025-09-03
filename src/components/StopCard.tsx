import type { IStop } from "../interface/Stop";
import { BiEditAlt, BiTrashAlt, BiCheckCircle } from "react-icons/bi";

const StopCard = ({ stop, isActive, onSelect, onDelete }: { stop: IStop, isActive: boolean, onSelect: () => void, onDelete:(value:IStop)=>void }) => (
    <div onClick={onSelect} className={isActive ? "bg-beige dark:bg-beige-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 p-4"
        : "bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 p-4"}>
        <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{stop.addresName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">{stop.addres}, {stop.Comuna?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">📞 {stop.phone}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">🛒 {stop.Sell?.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Estado: {stop.status}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Fragil: {stop.fragile ? 'Sí' : 'No'} | Devolución: {stop.devolution ? 'Sí' : 'No'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
                Conductor: {stop.Driver ? `${stop.Driver.User?.firstName} ${stop.Driver.User?.lastName}` : 'No asignado'}
            </p>
        </div>
        <div className="grid grid-row justify-items-end">
            {stop.status !== 'delivery' && <><button className="flex text-sm text-gray-600 dark:text-gray-300" onClick={()=>onDelete(stop)}><BiTrashAlt size={24} color="red" />Eliminar</button>
                <button className="flex text-sm text-gray-600 dark:text-gray-300"><BiEditAlt size={24} color="yellow" />Editar</button>
                <button className="flex text-sm text-gray-600 dark:text-gray-300"><BiCheckCircle size={24} color="green" />Reasignar</button></>}
        </div>
    </div>
);

export default StopCard;