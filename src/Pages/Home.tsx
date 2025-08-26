import  { useEffect, useState } from 'react'
import ChartCard from '../components/ChartCard'
import { listStopChart, listStopsComunas } from '../api/Stops';
import type { responseChart } from '../interface/Stop';
import { useUser } from '../context/UserContext';


const Home = () => {
  const [data1, setData1] = useState<responseChart[] | undefined>(undefined);
  const [data2, setData2] = useState<responseChart[] | undefined>(undefined);
  const { token } = useUser();
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, status } = await listStopChart(token);
        if (status === 200 && data) {
          setData2(data);
          //console.log(data)
        }
        const { data: dat, status: sta } = await listStopsComunas(token);
        if (sta === 200 && dat) {
          setData1(dat);
        }

      } catch (error) {
        console.log(error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Descripción */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Resumen de actividad</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Esta pantalla muestra estadísticas clave sobre el uso de la app, las entregas en sus diferentes estados, entregas por conductores y puntos por tienda.
          Puedes visualizar tendencias, detectar cuellos de botella y tomar decisiones informadas.
        </p>
      </section>

      {/* Gráficos */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Registros entregas por fecha" data={data2} />
        <ChartCard title="Registros por comuna" data={data1} />
      </section>
    </div>
  )
}

export default Home