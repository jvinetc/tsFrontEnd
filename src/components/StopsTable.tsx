import { useEffect, useState } from 'react'
//import Paginator from './Paginator';
import { useLoading } from '../context/LoadingContext';
import {
    asignDriver, disableStop, getStopsDelivered, getStopsPending, listStops,/* , listStopsByAdmin */
    updateStop
} from '../api/Stops';
import { useUser } from '../context/UserContext';
import type { IStop } from '../interface/Stop';
import { FaFileExcel, FaPlus } from 'react-icons/fa6';
import { useMessage } from '../context/MessageContext ';
import StopCard from './StopCard';
import MapView from './MapView';
import { useConfirmDialog } from '../hooks/useConfirmDialog';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import Paginator from './Paginator';
import { createPickUp } from '../api/PickUp';

const StopsTable = () => {

    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    const [stopsByMap, setStopsByMap] = useState<IStop[] | undefined | null>();
    const { showMessage } = useMessage();
    const [activeStopId, setActiveStopId] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirmDialog();
    const [activeTab, setActiveTab] = useState<'to_be_paid' | 'pickUp' | 'delivered'>('pickUp');
    const [search, setSearch] = useState<string>('');
    const [limit, setLimit] = useState<number>(10);
    const [order, setOrder] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                setLoading(true);
                let response;
                switch (activeTab) {
                    case 'to_be_paid':
                        response = await getStopsPending(token);
                        if (response && response.data)
                            setStopsByMap(response.data);
                        break;
                    case 'pickUp':
                        response = await listStops(token);
                        if (response && response.data)
                            setStopsByMap(response.data);
                        break;
                    case 'delivered':
                        if (search && search.length < 3) return;
                        response = await getStopsDelivered({ token, limit, order, page, search });
                        if (response && response.data) {
                            setStopsByMap(response.data.stops);
                            setCount(response.data.count);
                        }
                        break;
                    default:
                        break;
                }

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [search, page, order, limit, !stopsByMap, activeTab]);

    const handleAsign = async () => {
        setLoading(true);
        try {
            const { data, status } = await asignDriver(token);
            if (status !== 200 || !data) {
                showMessage({ text: 'Error en el servidor, intente mas tarde', type: "info" })
                return;
            }
            showMessage({ text: 'Conductores asignados exitosamente.', type: "info" });
            setStopsByMap(null);
        } catch (error) {
            showMessage({ text: 'Error en el servidor, intente mas tarde', type: "info" })
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (stop: IStop) => {
        const accepted = await confirm('¿Estás seguro de que deseas eliminar esta parada?');
        if (!accepted) {
            showMessage({ text: 'Operacion cancelada', type: 'info' })
            return;
        }
        setLoading(true);
        try {

            await disableStop(stop, token);
            showMessage({ text: 'Punto eliminado con exito', type: 'success' })
            setStopsByMap(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const changeStatus = async ({ stop, status }: { stop: IStop, status: string }) => {
        setLoading(true);
        try {
            stop.status = status;
            if (status === 'delivery') {
                await createPickUp({ token, data: { sellId: stop.sellId, stopId: stop.id, driverId: stop.driverId ?? 0 } });
                stop.driverId = null;
            }
            await updateStop(stop, token);
            setStopsByMap(null);
            showMessage({ text: `El estado cambio a ${status} correctamente`, type: 'success' })
        } catch (error) {
            showMessage({ text: `Error en el servidor, intente mas tadre`, type: 'error' })
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const generateExcel = () => {
        const headers = ['DIRECCION', 'COMUNA', 'DPTO / TORRE / REFERENCIAS', 'CLIENTE(nombre)', 'TELEFONO',
            'CORREO', 'NOMBRE DE TIENDA'];
        const data = stopsByMap ? stopsByMap.map((stop: IStop) => {
            return [
                stop.addres,
                stop.Comuna?.name,
                stop.notes,
                stop.addresName,
                stop.phone,
                stop.Sell?.email,
                stop.Sell?.name
            ];
        }) : [];
        // Crea hoja con headers y una fila vacía
        const worksheet = xlsx.utils.aoa_to_sheet([headers, ...data]);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Template');

        const excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        saveAs(blob, 'Compilado de stops.xlsx');
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Listado de paradas</h2>
                {activeTab === 'pickUp' &&
                    <div className='grid grid-cols-2 gap-3'>
                        <button onClick={generateExcel} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                            <FaFileExcel /> Desacargar Excel
                        </button>
                        <button onClick={handleAsign} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                            <FaPlus /> Asignar Conductores
                        </button>
                    </div>}
            </div>
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('to_be_paid')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'to_be_paid'
                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    Por Pagar
                </button>
                <button
                    onClick={() => setActiveTab('pickUp')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'pickUp'
                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    En ruta
                </button>
                <button
                    onClick={() => setActiveTab('delivered')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'delivered'
                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    Entregados
                </button>
            </div>
            {activeTab === 'delivered' && <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por comuna, tienda o conductor"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Dropdown de ordenamiento */}
                <select
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Ordenar por...</option>
                    <option value="createAt_ASC">Fecha Ascendente</option>
                    <option value="createAt_DESC">Fecha Descendente</option>
                </select>
                <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Cantida por pagina...</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                </select>
            </div>}
            {!isLoading && stopsByMap &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-100px)] p-4">
                    {/* Tarjetas de paradas */}
                    <div className="overflow-y-auto space-y-4">
                        {stopsByMap.map((s: IStop) => (
                            <StopCard key={s.id} stop={s} isActive={activeStopId === s.id}
                                onSelect={() => setActiveStopId(s.id ?? 0)} onDelete={handleDelete}
                                changeStatus={changeStatus} />
                        ))}
                    </div>
                    {/* Mapa */}
                    <div className="rounded-lg overflow-hidden shadow border">
                        <MapView stops={stopsByMap} setActiveStopId={setActiveStopId} activeStopId={activeStopId ?? 0} />
                    </div>
                    <ConfirmDialog />
                </div>}
            {activeTab === 'delivered' && <Paginator
                currentPage={page}
                totalPages={limit}
                onPageChange={(newPage) => setPage(newPage)}
                count={count}
            />}
        </div>
    )
}

export default StopsTable