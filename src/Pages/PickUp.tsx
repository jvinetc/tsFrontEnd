import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext';
import { useUser } from '../context/UserContext';
import { getPickUps } from '../api/PickUp';
import type { IPickUp } from '../interface/PickUp';
import Paginator from '../components/Paginator';
import PickupCard from '../components/PickupCard';

const PickUp = () => {
    const [pickUps, setPickups] = useState<IPickUp[]>([]);
    const [search, setSearch] = useState<string>('')
    const [order, setOrder] = useState<string>('')
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [count, setCount] = useState(0);
    const { isLoading, setLoading } = useLoading();
    const [activeStopId, setActiveStopId] = useState<number>();
    const { token } = useUser();


    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                if (search && search.length < 3) return;
                const { data } = await getPickUps({ token, search, limit, page, order });
                if (!data || !data.pickUp) return;
                setPickups(data.pickUp)
                setCount(data.count);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [page, search, order, limit]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Retiros</h1>
            {!isLoading && pickUps.length > 0 ? <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Input de búsqueda */}
                    <input
                        type="text"
                        placeholder="Buscar por conductor o tienda"
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
                        <option value="20C">20</option>
                    </select>
                </div>
                {pickUps.map((p: IPickUp) => (
                    <PickupCard pickUp={p}
                        isActive={activeStopId === Number(p.id)}
                        onSelect={() => setActiveStopId(Number(p.id ?? 0))} key={p.id} />
                ))

                }

                <Paginator
                    currentPage={page}
                    totalPages={limit}
                    onPageChange={(newPage) => setPage(newPage)}
                    count={count}
                />
            </> :
                <h1>Aun No hay contenido para mostrar</h1>}
        </div>
    )
}

export default PickUp