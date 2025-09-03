import { useEffect, useState } from 'react'
//import Paginator from './Paginator';
import { useLoading } from '../context/LoadingContext';
import { asignDriver, disableStop, listStops/* , listStopsByAdmin */ } from '../api/Stops';
import { useUser } from '../context/UserContext';
import type { IStop } from '../interface/Stop';
import { FaPlus } from 'react-icons/fa6';
import { useMessage } from '../context/MessageContext ';
import StopCard from './StopCard';
import MapView from './MapView';
import { useConfirmDialog } from '../hooks/useConfirmDialog';

const StopsTable = () => {

    /*   const [page, setPage] = useState(1); */
    /*  const [limit, setLimit] = useState(5);
     const [count, setCount] = useState(0); */
    /* const [filters, setFilters] = useState<string>(); */
    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    /* const [stops, setStops] = useState<IStop[] | undefined | null>(); */
    const [stopsByMap, setStopsByMap] = useState<IStop[] | undefined | null>();
    const { showMessage } = useMessage();
    const [activeStopId, setActiveStopId] = useState<number | null>(null);
    const { confirm, ConfirmDialog } = useConfirmDialog();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                setLoading(true);
                /* if (filters && filters.length < 3) return;
                const { data, status } = await listStopsByAdmin({ token, search: filters, page, limit }); */
                const response = await listStops(token);
                /* if (status !== 200 || !data) return; */
                /*  setStops(data.stops); */
                if (response.data)
                    setStopsByMap(response.data);
                /* setCount(data.count) */
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [/* filters, page, */ /* !stops */ !stopsByMap]);

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

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Listado de paradas</h2>
                <button onClick={handleAsign} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Asignar Conductores
                </button>
            </div>

            {/* Filtros */}
            {/*  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Busque por patente, nombre o apellido del conductor" value={filters} className="input" onChange={(e) => setFilters(e.target.value)} />
            </div> */}
            {!isLoading /* && stops */ && stopsByMap &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[calc(100vh-100px)] p-4">
                    {/* Tarjetas de paradas */}
                    <div className="overflow-y-auto space-y-4">
                        {stopsByMap.map((s: IStop) => (
                            <StopCard key={s.id} stop={s} isActive={activeStopId === s.id}
                                onSelect={() => setActiveStopId(s.id ?? 0)} onDelete={handleDelete} />
                        ))}
                    </div>
                    {/* Mapa */}
                    <div className="rounded-lg overflow-hidden shadow border">
                        <MapView stops={stopsByMap} setActiveStopId={setActiveStopId} activeStopId={activeStopId ?? 0} />
                    </div>
                    <ConfirmDialog />
                </div>}

        </div>
    )
}

export default StopsTable