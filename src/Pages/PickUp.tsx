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
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Retiros</h1>

            {/* 🔍 Filtros */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Input de búsqueda */}
                <div className="md:col-span-2">
                    <label htmlFor="search" className="sr-only">Buscar</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Buscar por conductor o tienda"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Ordenamiento */}
                <div>
                    <label htmlFor="order" className="sr-only">Ordenar</label>
                    <select
                        id="order"
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Ordenar por...</option>
                        <option value="createAt_ASC">Fecha Ascendente</option>
                        <option value="createAt_DESC">Fecha Descendente</option>
                    </select>
                </div>

                {/* Cantidad por página */}
                <div>
                    <label htmlFor="limit" className="sr-only">Cantidad por página</label>
                    <select
                        id="limit"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Cantidad por página...</option>
                        {[5, 10, 15, 20].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </div>
            </section>

            {/* 📦 Resultados */}
            {!isLoading && pickUps.length > 0 ? (
                <section className="space-y-4">
                    {pickUps.map((p: IPickUp) => (
                        <PickupCard
                            key={p.id}
                            pickUp={p}
                            isActive={activeStopId === Number(p.id)}
                            onSelect={() => setActiveStopId(Number(p.id ?? 0))}
                        />
                    ))}

                    <Paginator
                        currentPage={page}
                        totalPages={limit}
                        onPageChange={(newPage) => setPage(newPage)}
                        count={count}
                    />
                </section>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No hay retiros para mostrar.</p>
            )}
        </div>
    )
}

export default PickUp