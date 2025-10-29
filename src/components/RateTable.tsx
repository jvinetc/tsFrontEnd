import { useEffect, useState } from 'react'
import type { IRate } from '../interface/Rate';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext ';
import { disableRate, getRatesByAdmin } from '../api/Rate';
import { useLoading } from '../context/LoadingContext';
import Paginator from './Paginator';
import { Link } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';

const RateTable = () => {
    const [rates, setRates] = useState<IRate[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const { token } = useUser();
    const { isLoading, setLoading } = useLoading();
    const { showMessage } = useMessage();
    const [filters, setFilters] = useState('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(5);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (filters && filters.length < 3) return;
                const { data, status } = await getRatesByAdmin({ token, search: filters, page, limit });
                if (status !== 200 || !data || !data.rates) {
                    showMessage({ text: 'Error al cargar los datos, intente mas tarde', type: 'info' });
                    return;
                }
                setCount(data.count);
                setRates(data.rates);
            } catch (error) {
                console.log(error);
                showMessage({ text: 'Error al cargar los datos, intente mas tarde', type: 'error' });
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [page, filters]);

    const onDelete = async (id: number) => {
        setLoading(true);
        try {
            await disableRate(token, id)
            showMessage({ text: 'Conductor desabilitado correctamente', type: 'success' });
            setPage(1);
        } catch (error) {
            console.log(error);
            showMessage({ text: 'Error al eliminar, intente mas tarde', type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Conductores</h2>
                <Link to="/prices/create" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Nueva tarifa
                </Link>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Busque por patente, nombre o apellido del conductor" value={filters} className="input" onChange={(e) => setFilters(e.target.value)} />
            </div>

            {/* Tabla */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                        <th className="p-2">id</th>
                        <th className="p-2">Nombre del servicio</th>
                        <th className="p-2">Precio</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && rates && rates.length > 0 && rates.map((r: IRate) => (
                        <tr key={r.id} className="border-b dark:border-gray-600">
                            <td className="p-2">{r.id}</td>
                            <td className="p-2">{r.nameService}</td>
                            <td className="p-2">{r.price}</td>
                            <td className="p-2">{r.state}</td>
                            <td className="p-2 flex gap-2">
                                <Link to={`/prices/edit/${r.id}`} className="text-blue-600 hover:text-blue-800"><FaEdit /></Link>
                                <button onClick={() => onDelete(Number(r.id))} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                            </td>
                        </tr>)
                    )}
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

export default RateTable