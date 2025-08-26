import { useEffect, useState } from 'react'
import Paginator from './Paginator';
import { useLoading } from '../context/LoadingContext';
import { asignDriver, listStopsByAdmin } from '../api/Stops';
import { useUser } from '../context/UserContext';
import type { IStop } from '../interface/Stop';
import { FaPlus } from 'react-icons/fa6';
import { useMessage } from '../context/MessageContext ';

const StopsTable = () => {

    const [page, setPage] = useState(1);
    const [limit/* , setLimit */] = useState(5);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState<string>();
    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    const [stops, setStops] = useState<IStop[] | undefined | null>();
    const {showMessage} = useMessage();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                setLoading(true);
                if (filters && filters.length < 3) return;
                const { data, status } = await listStopsByAdmin({ token, search: filters, page, limit });
                if (status !== 200 || !data) return;
                setStops(data.stops);
                setCount(data.count)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [filters, page]);

    const handleAsign=async () => {
        setLoading(true);
        try{
            const {data, status} = await asignDriver(token);
            if(status!==200 || !data){
                showMessage({text:'Error en el servidor, intente mas tarde', type:"info"})
                return;
            }
            setPage(1);
            showMessage({text:'Conductores asignados exitosamente.', type:"info"})
        }catch(error){
             showMessage({text:'Error en el servidor, intente mas tarde', type:"info"})
            console.log(error);
        }finally{
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Busque por patente, nombre o apellido del conductor" value={filters} className="input" onChange={(e) => setFilters(e.target.value)} />
            </div>

            {/* Tabla */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                        <th className="p-2">Id</th>
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Direccion</th>
                        <th className="p-2">Telefono</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Tienda</th>
                        <th className="p-2">Fragil/Devolucion</th>
                        <th className="p-2">Conductor</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && stops && stops.length > 0 && stops.map((s: IStop) => (
                        <tr key={s.id} className={`border-b dark:border-gray-600`}>
                            <td className="p-2">{s.id}</td>
                            <td className="p-2">{s.addresName}</td>
                            <td className="p-2">{`${s.addres}, ${s.Comuna?.name}`}</td>
                            <td className="p-2">{s.phone}</td>
                            <td className="p-2">{s.status}</td>
                            <td className="p-2">{s.Sell?.name}</td>
                            <td className="p-2">
                                <ul>
                                    <li>Fragil: {s.fragile ? 'si' : 'no'}</li>
                                    <li>Devolucion: {s.devolution ? 'si' : 'no'}</li>
                                </ul>
                            </td>
                            <td className="p-2">
                                {s.Driver !== null ?
                                    (`${s.Driver?.User?.firstName} ${s.Driver?.User?.lastName}`) :
                                    'Aun no se asigna conductor'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Paginator
                currentPage={page}
                totalPages={limit}
                onPageChange={(newPage) => setPage(newPage)}
                count={count}
            />
        </div>
    )
}

export default StopsTable