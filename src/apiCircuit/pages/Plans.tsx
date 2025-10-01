import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import type { IDriver, IPlan } from '../interface';
import { getPlans } from '../api/Plan';

const Plans = () => {
  const [startsLte, setStartsLte] = useState<string>(new Date().toISOString().split('T')[0]); //hasta
  const [startsGte, setStartsGte] = useState<string>(new Date().toISOString().split('T')[0]); //desde
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [pageToken, setPageToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {

    loadPlans();
  }, [startsLte, startsGte]);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const response = await getPlans({ startsGte, startsLte, pageToken });
      if (!response) return;
      setPlans(response.data.plans);
      setPageToken(response.data.nextPageToken);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">


      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="date"
          placeholder="Desde"
          name="startsGte"
          value={startsGte}
          max={new Date(new Date().setFullYear(new Date().getFullYear())).toISOString().split('T')[0]} // hoy
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0]}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setStartsGte(e.target.value)}
        />
        <input
          type="date"
          placeholder="Hasta"
          name="startsLte"
          value={startsLte}
          max={new Date(new Date().setFullYear(new Date().getFullYear())).toISOString().split('T')[0]} // hoy
          min={new Date(new Date().setFullYear(new Date().getFullYear() - 2)).toISOString().split('T')[0]}
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setStartsLte(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="p-2">Id Circuit</th>
            <th className="p-2">Titulo</th>
            <th className="p-2">Conductores</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading && plans && plans.length > 0 ? plans.map((p: IPlan) => (
            <tr key={p.id} className="border-b dark:border-gray-600">
              <td className="p-2"><button className="text-blue-600 dark:text-blue-400 underline relative group"
                onClick={() => navigate('/circuit/stops', {
                  state: {
                    id: p.id,
                  }
                })}  >{p.id}</button></td>
              <td className="p-2">{p.title}</td>
              <td className="p-2">
                <ul className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {p.drivers?.map((driver: IDriver) => (
                    <li>{driver.email}</li>
                  ))}
                </ul>
              </td>
            </tr>)
          ):<>
          No existen registros para esta busqueda
          </>}
        </tbody>
      </table>
      {pageToken && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => {
              setPageToken('');
              loadPlans();
            }}
            className="px-5 py-2 rounded font-medium bg-gray-200 w-20%
            hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 
            dark:text-white transition-colors"
          >
            Volver al inicio
          </button>
          <button
            onClick={loadPlans}
            disabled={isLoading}
            className={`rounded font-medium transition-colors w-15% ${isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {isLoading ? 'Cargando...' : 'Ver más'}
          </button>
        </div>
      )}
    </div >
  )
}

export default Plans