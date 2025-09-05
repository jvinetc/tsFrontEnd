import { useEffect, useState } from 'react'
import ChartCard from '../components/ChartCard'
import { listStopChart, listStopsComunas } from '../api/Stops';
import type { responseChart } from '../interface/Stop';
import { useUser } from '../context/UserContext';
import { payChart, paySellChart } from '../api/Payment';
import { getDeliveredChart } from '../api/Driver';
import { chartPickUps } from '../api/PickUp';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [chart1, setChart1] = useState<responseChart[] | undefined>(undefined);
  const [chart2, setChart2] = useState<responseChart[] | undefined>(undefined);
  const [chart3, setChart3] = useState<responseChart[] | undefined>(undefined);
  const [chart4, setChart4] = useState<responseChart[] | undefined>(undefined);
  const [chart5, setChart5] = useState<responseChart[] | undefined>(undefined);
  const [chart6, setChart6] = useState<responseChart[] | undefined>(undefined);
  const { token } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, status } = await listStopChart(token);
        if (status === 200 && data) {
          setChart2(data);
          //console.log(data)
        }
        const { data: dat, status: sta } = await listStopsComunas(token);
        if (sta === 200 && dat) {
          setChart1(dat);
        }

        const { data: pays, status: stat } = await payChart();
        if (stat === 200 && pays) {
          setChart3(pays);
        }

        const { data: sellsPay, status: statu } = await paySellChart();
        if (statu === 200 && sellsPay) {
          setChart4(sellsPay);
        }

        const { data: drivDeliv, status: st} = await getDeliveredChart(token);
        if (st === 200 && drivDeliv) {
          setChart5(drivDeliv);
        }

        const { data: pick, status: s} = await chartPickUps(token);
        if (s === 200 && pick) {
          setChart6(pick);
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
        <ChartCard title="Registros de compras por fecha" data={chart2} />
        <ChartCard title="Registros por comuna" data={chart1} />
        <ChartCard title="Registros de pagos por fecha" data={chart3} />
        <ChartCard title="Registros pagos por tienda" data={chart4} />
        <ChartCard title="Registros entregados por conductor" data={chart5} />
        <ChartCard title="Registros retirados por conductor" data={chart6} >
          <button onClick={()=>navigate('/pickups')}>Ver Detalles...</button>
        </ChartCard>
      </section>
    </div>
  )
}

export default Home