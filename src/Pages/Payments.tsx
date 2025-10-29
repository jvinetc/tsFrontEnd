import { useEffect, useState } from 'react'
import type { IPayment } from '../interface/Payment';
import { useLoading } from '../context/LoadingContext';
import { useUser } from '../context/UserContext';
import { getPays } from '../api/Payment';
import Paginator from '../components/Paginator';
import type { IStop } from '../interface/Stop';
import PaymentTable from '../components/PaymentTable';

type Response = {
  payment: IPayment;
  stops: IStop[];
}

const Payments = () => {

  const [response, setResponse] = useState<Response[]>([]);
  //const [isActive, setIsActive] = useState(false);
  const [search, setSearch] = useState<string>('')
  const [order, setOrder] = useState<string>('')
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [count, setCount] = useState(0);
  const { setLoading } = useLoading();
  const [activeStopId, setActiveStopId] = useState<number>();
  const { token } = useUser();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (search && search.length < 3) return;
        const { data } = await getPays({ token, search, limit, page, order });
        if (!data || !data.result) return;
        setResponse(data.result);
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar por orden de compra o tienda"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <option value="amount_ASC">Total Ascendente</option>
          <option value="amount_DESC">Total Descendente</option>
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
      {response.map(({ payment, stops }: Response) => (
        <PaymentTable payment={payment} stops={stops} 
        isActive={activeStopId === Number(payment.id)} 
        onSelect={() => setActiveStopId(Number(payment.id ?? 0))} key={payment.id} />
      ))

      }

      <Paginator
        currentPage={page}
        totalPages={limit}
        onPageChange={(newPage) => setPage(newPage)}
        count={count}
      />
    </div>
  )
}

export default Payments