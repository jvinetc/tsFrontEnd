import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { IDriver } from '../interface/Driver';
import { disableDriver, listDrivers } from '../api/Driver';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext ';
import { useLoading } from '../context/LoadingContext';
import { FaFilePdf, FaPlus, FaTrash } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import Paginator from './Paginator';

const DriversTable = () => {
    const [drivers, setDrivers] = useState<IDriver[] | null>(null);
    const [countDrivers, setCountDrivers] = useState<number>(0);
    const { token } = useUser();
    const { isLoading, setLoading } = useLoading();
    const { showMessage } = useMessage();
    const [filters, setFilters] = useState('');
    const API_URL = import.meta.env.VITE_SERVER;
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(5);
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (filters && filters.length < 3) return;
                const { data, status } = await listDrivers({ token, search: filters, page, limit });
                if (status !== 200 || !data) {
                    showMessage({ text: 'Error al cargar los datos, intente mas tarde', type: 'info' });
                    return;
                }
                setCountDrivers(data.drivers.length);
                setDrivers(data.drivers);
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
            await disableDriver(token, id)
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
                <Link to="/drivers/create" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Nuevo
                </Link>
            </div>

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" placeholder="Busque por patente, nombre o apellido del conductor" value={filters} className="input" onChange={(e) => setFilters(e.target.value)} />
                {/* <input type="date" placeholder="Vencimiento" className="input" onChange={(e) => setFilters(f => ({ ...f, vencimiento: e.target.value }))} />
                <input type="text" placeholder="Comuna" className="input" onChange={(e) => setFilters(f => ({ ...f, comuna: e.target.value }))} />
                <input type="text" placeholder="Tipo vehículo" className="input" onChange={(e) => setFilters(f => ({ ...f, tipoVehiculo: e.target.value }))} /> */}
            </div>

            {/* Tabla */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-left">
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Comunas</th>
                        <th className="p-2">Patente</th>
                        <th className="p-2">Estado</th>
                        <th className="p-2">Documentos</th>
                        <th className="p-2">Vencimientos</th>
                        <th className="p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && drivers && drivers.length > 0 && drivers.map((d: IDriver) => (
                        (d.status !== 'inactive' && <tr key={d.id} className="border-b dark:border-gray-600">
                            <td className="p-2">{d.User && `${d.User.firstName} ${d.User.lastName}`}</td>
                            <td className="p-2">
                                <ul>
                                    {d.Comunas && d.Comunas.map(c => <li key={c.id}>{c.name}</li>)}
                                </ul>
                            </td>
                            <td className="p-2">{d.patente}</td>
                            <td className="p-2">{d.status}</td>
                            <td className="p-2">
                                <ul>
                                    <li >
                                        <a
                                            href={`${API_URL}/uploads/${d.liceciaConducir}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaFilePdf className="h-5 w-5" />
                                            Licencia
                                        </a>

                                        {/* Vista previa tipo burbuja */}
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-2 z-50 hidden group-hover:block">
                                            <iframe
                                                src={`${API_URL}/uploads/${d.liceciaConducir}`}
                                                className="w-full h-40"
                                                title="Vista previa PDF"
                                            />
                                        </div>
                                    </li>
                                    <li >
                                        <a
                                            href={`${API_URL}/uploads/${d.permisoCirculacion}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaFilePdf className="h-5 w-5" />
                                            Circulacion
                                        </a>

                                        {/* Vista previa tipo burbuja */}
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-2 z-50 hidden group-hover:block">
                                            <iframe
                                                src={`${API_URL}/uploads/${d.permisoCirculacion}`}
                                                className="w-full h-40"
                                                title="Vista previa PDF"
                                            />
                                        </div>
                                    </li>
                                    <li >
                                        <a
                                            href={`${API_URL}/uploads/${d.revicionTecnica}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                        >
                                            <FaFilePdf className="h-5 w-5" />
                                            Revision
                                        </a>

                                        {/* Vista previa tipo burbuja */}
                                        <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg p-2 z-50 hidden group-hover:block">
                                            <iframe
                                                src={`${API_URL}/uploads/${d.revicionTecnica}`}
                                                className="w-full h-40"
                                                title="Vista previa PDF"
                                            />
                                        </div>
                                    </li>
                                </ul>

                            </td>
                            <td className="p-2">
                                <ul>
                                    <li>{new Date(d.vencimientoLiceciaConducir).toLocaleDateString('Es-es').split('T')[0]}</li>
                                    <li>{new Date(d.vencimientoPermisoCirculacion).toLocaleDateString('Es-es').split('T')[0]}</li>
                                    <li>{new Date(d.vencimientoRevicionTecnica).toLocaleDateString('Es-es').split('T')[0]}</li>
                                </ul>
                            </td>
                            <td className="p-2 flex gap-2">
                                <Link to={`/drivers/edit/${d.id}`} className="text-blue-600 hover:text-blue-800"><FaEdit /></Link>
                                <button onClick={() => onDelete(Number(d.id))} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                            </td>
                        </tr>)
                    ))}
                </tbody>
            </table>
            <Paginator
                currentPage={page}
                totalPages={limit}
                onPageChange={(newPage) => setPage(newPage)}
                count={countDrivers}
            />
        </div>
    )
}

export default DriversTable