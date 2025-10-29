import { useEffect, useState } from "react";
import { useLoading } from "../../context/LoadingContext";
import { useMessage } from "../../context/MessageContext ";
import { syncApp } from "../api/Stop";
import { syncDriversCircuit } from "../api/Driver";
import { createPlan, getPlanByDay, optimizePlan, sendPlanDrivers } from "../api/Plan";
import type { IPlan } from "../interface";

const HomeCircuit = () => {
  const { setLoading } = useLoading();
  const { showMessage } = useMessage();

  const [syncStops, setSyncStops] = useState(false);
  const [syncDrivers, setSyncDrivers] = useState(false);
  const [plan, setPlan] = useState<IPlan>();
  const [stepStatus, setStepStatus] = useState([false, true, true, true, true]);

  useEffect(() => {
    verifyPlan();
  }, []);

  const verifyPlan = async () => {
    try {
      setLoading(true);
      const fecha = new Date();
      const { data } = await getPlanByDay({
        day: fecha.getDate(),
        month: fecha.getMonth() + 1,
        year: fecha.getFullYear(),
      });
      if (data) {
        setStepStatus([true, true, true, true, true]);
        setPlan(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const revertStep = (index: number) => {
    const updated = [...stepStatus];
    /* for (let i = index; i < updated.length; i++) */ updated[index] = false;
    setStepStatus(updated);
    showMessage({ text: `Paso ${index + 1} revertido. Puedes ejecutarlo nuevamente.`, type: "info" });
  };

  const steps = [
    {
      title: "Preparar Sincronización",
      description: "Se preparas las paradas para ser enviadas a circuit, y se verificara la informacion de los conductores",
      action: async () => {
        try {
          setLoading(true);
          const { data } = await syncApp();
          const { deliveries, driversSincronizados, message, pickups, plan } = data;
          if (!deliveries || !pickups) {
            showMessage({ text: "Las paradas no pudieron ser sincronizadas", type: "info" });
            return;
          }
          setSyncStops(deliveries);
          setSyncDrivers(driversSincronizados);
          setPlan(plan);
          showMessage({ text: message, type: "success" });
          const updated = [...stepStatus];
          updated[0] = true;
          updated[driversSincronizados ? 2 : 1] = false;
          setStepStatus(updated);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      buttonLabel: "Ejecutar Paso 1",
      disabled: stepStatus[0],
      canRevert: false,
    },
    {
      title: "Sincronizar Conductores",
      description: "Actualiza la información de tus conductores.",
      action: async () => {
        try {
          setLoading(true);
          const { data } = await syncDriversCircuit();
          showMessage({ text: data.success?.message ?? "", type: "info" });
          const updated = [...stepStatus];
          updated[1] = true;
          updated[2] = false;
          setStepStatus(updated);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      buttonLabel: "Ejecutar Paso 2",
      disabled: !stepStatus[0] || stepStatus[1],
      canRevert: true,
    },
    {
      title: "Crear Ruta",
      description: "Crea una ruta con paradas para tus conductores.",
      action: async () => {
        try {
          setLoading(true);
          const { data } = await createPlan(String(plan?.id));
          showMessage({ text: data.success?.message ?? "", type: "info" });
          const updated = [...stepStatus];
          updated[2] = true;
          updated[3] = false;
          setStepStatus(updated);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      buttonLabel: "Ejecutar Paso 3",
      disabled: !stepStatus[1] || stepStatus[2],
      canRevert: true,
    },
    {
      title: "Optimizar Ruta",
      description: "Solicita a Circuit que optimice las rutas.",
      action: async () => {
        try {
          setLoading(true);
          const { data } = await optimizePlan(String(plan?.id));
          showMessage({ text: data.success?.message ?? "", type: "info" });
          const updated = [...stepStatus];
          updated[3] = true;
          updated[4] = false;
          setStepStatus(updated);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      buttonLabel: "Ejecutar Paso 4",
      disabled: !stepStatus[2] || stepStatus[3],
      canRevert: true,
    },
    {
      title: "Enviar Ruta",
      description: "Envía automáticamente la ruta a tus conductores.",
      action: async () => {
        try {
          setLoading(true);
          const { data } = await sendPlanDrivers(String(plan?.id_router_api));
          showMessage({ text: data.success?.message ?? "", type: "info" });
          const updated = [...stepStatus];
          updated[4] = true;
          setStepStatus(updated);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      buttonLabel: "Ejecutar Paso 5",
      disabled: !stepStatus[3] || stepStatus[4],
      canRevert: false,
    },
  ];

  return (
    <div className="space-y-6">
      <section className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-400 rounded">
        <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">⚠️ Módulo Crítico: Sincronización Circuit</h2>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
          Este proceso afecta directamente la planificación y ejecución de rutas. Sigue los pasos en orden y espera la confirmación antes de avanzar.
        </p>
      </section>

      <section className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative border-l-4 pl-6 border-blue-500 dark:border-blue-400">
            <div className="absolute -left-6 top-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
              {index + 1}
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{step.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>

              {index === 1 && syncStops && (
                <div className="mt-4 text-sm text-gray-700 dark:text-gray-200">
                  ✅ Paradas sincronizadas. Ruta creada: <span className="font-semibold">{plan?.title}</span>.
                  {syncDrivers ? (
                    <p className="text-green-600 dark:text-green-400">🟢 Conductores sincronizados correctamente.</p>
                  ) : (
                    <p className="text-yellow-600 dark:text-yellow-400">⚠️ Faltan conductores por sincronizar.</p>
                  )}
                </div>
              )}

              {index === 2 && plan && (
                <p className="mt-2 text-purple-600 dark:text-purple-400 font-semibold bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">
                  Estás trabajando con la ruta <span>{plan.title}</span>.
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={step.action}
                  disabled={step.disabled}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    step.disabled
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {step.buttonLabel}
                </button>

                {step.canRevert && stepStatus[index] && (
                  <button
                    onClick={() => revertStep(index)}
                    className="px-4 py-2 rounded font-semibold bg-red-500 hover:bg-red-600 text-white"
                  >
                    ⮐ Revertir
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomeCircuit;