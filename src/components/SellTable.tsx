import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext';
import { useUser } from '../context/UserContext';
import type { ISell } from '../interface/Sell';
import { getSells } from '../api/Sell';
import Paginator from './Paginator';

const SellTable = () => {
    const [page, setPage] = useState(1);
    const [limit/* , setLimit */] = useState(5);
    const [count, setCount] = useState(0);
    const [filters, setFilters] = useState<string>();
    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    const [sells, setSells] = useState<ISell[] | undefined | null>();
    //const { showMessage } = useMessage();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                setLoading(true);
                if (filters && filters.length < 3) return;
                const { data, status } = await getSells({ token, search: filters, page, limit });
                if (status !== 200 || !data) return;
                setSells(data.sells);
                setCount(data.count)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [filters, page]);
    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Listado de tiendas</h2>
                {/* <button onClick={handleAsign} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Asignar Conductores
                </button> */}
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
                        <th className="p-2">Encargado</th>
                        <th className="p-2">EMail</th>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && sells && sells.length > 0 && sells.map((s: ISell) => (
                        <tr key={s.id} className={`border-b dark:border-gray-600`}>
                            <td className="p-2">{s.id}</td>
                            <td className="p-2">{s.name}</td>
                            <td className="p-2">{`${s.addres}, ${s.Comuna?.name}`}</td>
                            <td className="p-2">{s.User?.phone}</td>
                            <td className="p-2">{`${s.User?.firstName} ${s.User?.lastName}`}</td>
                            <td className="p-2">{s.email}</td>
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

export default SellTable