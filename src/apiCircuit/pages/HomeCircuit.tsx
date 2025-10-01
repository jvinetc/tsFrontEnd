import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { syncApp } from "../api/Stop";
import type { IPlan } from "../interface";
import { useMessage } from "../../context/MessageContext ";
import { syncDriversCircuit } from "../api/Driver";
import { createPlan, getPlanByDay, optimizePlan, sendPlanDrivers } from "../api/Plan";

const HomeCircuit = () => {
  const { setLoading } = useLoading();
  const { showMessage } = useMessage();
  const [syncStops, setSyncStops] = useState<boolean>(false);
  const [syncDrivers, setSyncDrivers] = useState<boolean>(false);
  const [plan, setPlan] = useState<IPlan>();
  const [buttonStep, setButtonStep] = useState({
    step1: false,
    step2: true,
    step3: true,
    step4: true,
    step5: true,
  });

  useEffect(() => {
    verifyPlan();
  }, [])

  const verifyPlan = async () => {
    try {
      setLoading(true);
      const fecha = new Date();
      const day = fecha.getDate();
      const month = fecha.getMonth() + 1;
      const year = fecha.getFullYear();
      const { data } = await getPlanByDay({ day, month, year });
      if (!data) return;
      setButtonStep({ ...buttonStep, step1: true });
      setPlan(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const sincronizarApps = async () => {
    try {
      setLoading(true);
      const { data } = await syncApp();
      const { deliveries, driversSincronizados, message, pickups, plan } = data;
      if (!deliveries || !pickups) {
        showMessage({ text: 'Las paradas no pudieron ser sincronizadas', type: 'info' });
        return;
      }
      setSyncStops(deliveries);
      setButtonStep({ ...buttonStep, step1: true });
      setSyncDrivers(driversSincronizados);
      showMessage({ text: message, type: 'success' });
      setPlan(plan);
      if (driversSincronizados) {
        setButtonStep({ ...buttonStep, step3: false })
      } else {
        setButtonStep({ ...buttonStep, step2: false })
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const sincronizarConductores = async () => {
    try {
      setLoading(true);
      const { data } = await syncDriversCircuit();
      showMessage({ text: data.success?.message ?? '', type: 'info' });
      setButtonStep({ ...buttonStep, step2: true, step3: false })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const crearPlan = async () => {
    try {
      setLoading(true);
      const { data } = await createPlan(String(plan?.id));
      showMessage({ text: data.success?.message ?? '', type: 'info' });
      setButtonStep({ ...buttonStep, step3: true, step4: false })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const optPlan = async () => {
    try {
      setLoading(true);
      const { data } = await optimizePlan(String(plan?.id));
      showMessage({ text: data.success?.message ?? '', type: 'info' });
      setButtonStep({ ...buttonStep, step4: true, step5: false })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const sendPlan = async () => {
    try {
      setLoading(true);
      const { data } = await sendPlanDrivers(String(plan?.id));
      showMessage({ text: data.success?.message ?? '', type: 'info' });
      setButtonStep({ ...buttonStep, step5: true })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-xl font-semibold text-black-800 dark:text-white mb-2">
        MODULO CIRCUIT
      </h1>
      <div className="p-4 space-y-6 mx-auto bg-white dark:bg-gray-800 rounded shadow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* instrucciones */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-blue-600 text-white text-2xl font-bold h-12 flex items-center justify-center rounded shadow-lg ring-2 ring-gray dark:ring-gray-900 z-10">
            Instrucciones
          </div>
          <button
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-400"
            disabled={true}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              📦 Sigue el orden de los botones del 1 al 5.
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Espera a que se ejecute cada tarea y tu informacion se reflejara en la app de circuit,
              y finalmente sera enviada a tus conductores.
            </p>
          </button>
        </div>
        {/* Paso 1 */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-blue-600 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg ring-4 ring-white dark:ring-gray-900 z-10">
            1
          </div>
          <button
            onClick={() => sincronizarApps()}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-400"
            disabled={buttonStep.step1}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              📦 Sincronizar Apps
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Precaución: sincronizará la información de tu cuenta de Circuit con esta aplicación.
            </p>
          </button>
        </div>

        {/* Paso 2 */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-green-600 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg ring-4 ring-white dark:ring-gray-900 z-10">
            2
          </div>
          <button
            onClick={() => sincronizarConductores()}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-green-500 dark:hover:border-green-400"
            disabled={buttonStep.step2}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🧑‍✈️ Sincronizar Conductores
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Mantén actualizada la información de tus conductores entre Circuit y esta aplicación.
            </p>
            {syncStops && (
              <div className="mt-4 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-lg transition-all">
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                  ✅ Las paradas se sincronizaron con éxito y se creó una ruta en Circuit con el nombre <span className="font-semibold">{plan?.title}</span>.
                </p>
                {syncDrivers ? (
                  <p className="text-sm text-green-700 dark:text-green-400">
                    🟢 Los conductores fueron sincronizados correctamente. Puedes avanzar al tercer paso.
                  </p>
                ) : (
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    ⚠️ Existen conductores en tu sistema que no están en Circuit. Por favor, sincroniza los conductores.
                  </p>
                )}
              </div>
            )}
          </button>
        </div>

        {/* Paso 3 */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-purple-600 text-white text-4xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg ring-4 ring-white dark:ring-gray-900 z-10">
            3
          </div>
          <button
            onClick={() => crearPlan()}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-purple-500 dark:hover:border-purple-400"
            disabled={buttonStep.step3}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🗂️ Crear Plan
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Crea un plan con paradas para tus conductores. Asegúrate de haber completado todos los pasos.
            </p>

            {plan && <p className="text-purple-600 dark:text-purple-400 font-semibold bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
              Estás trabajando con la ruta <span >
                {plan.title}
              </span>.
            </p>}
          </button>
        </div>

        {/* Paso 4 */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-purple-600 text-white text-5xl font-bold w-12 h-12 flex 
        items-center justify-center rounded-full shadow-lg ring-4 
        ring-white dark:ring-gray-900 z-10 hover:scale-105">
            4
          </div>
          <button
            onClick={() => optPlan()}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-purple-500 dark:hover:border-purple-400"
            disabled={buttonStep.step4}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🚀 Optimizar Ruta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Solicita a Circuit que optimice las rutas. Luego, envíalas a tus conductores desde Circuit.
            </p>
          </button>
        </div>
        {/* Paso 5 */}
        <div className="relative">
          <div className="absolute -top-6 -left-6 bg-purple-600 text-white text-5xl font-bold w-12 h-12 flex 
        items-center justify-center rounded-full shadow-lg ring-4 
        ring-white dark:ring-gray-900 z-10 hover:scale-105">
            5
          </div>
          <button
            onClick={() => sendPlan()}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 text-left shadow hover:shadow-lg transition-all hover:border-purple-500 dark:hover:border-purple-400"
            disabled={buttonStep.step5}
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              🚀 Enviar Ruta
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Envia de manera automatica la ruta a tus conductores.
            </p>
          </button>
        </div>
      </div>
    </>
  )
}

export default HomeCircuit