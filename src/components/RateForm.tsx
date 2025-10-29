import { useEffect, useState } from "react";
import type { IRate } from "../interface/Rate";
import { useLoading } from "../context/LoadingContext";
import { useUser } from "../context/UserContext";
import { useMessage } from "../context/MessageContext ";
import { useNavigate, useParams } from "react-router-dom";
import { createRate, getRateById, updateRate } from "../api/Rate";

const RateForm = () => {
    const [rate, setRate] = useState<IRate | null | undefined>();
    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    const { showMessage } = useMessage();
    const [isEdit, setIsEdit] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    //const API_URL= import.meta.env.VITE_SERVER;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                if (id) {
                    setIsEdit(true);
                    await loadRate(Number(id));
                }
            } catch (error) {
                console.log(error);
                showMessage({ text: 'No pudieron ser cargados los datos, intente mas tarde', type: 'error' })
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [])

    const loadRate = async (id: number) => {
        setLoading(true);
        try {
            const { data: d, status } = await getRateById(token, Number(id))
            if (!d || status !== 200) return;
            setRate(d);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    }


    const handleSubmit = async () => {

        try {
            setLoading(true);
            if (!rate || !rate.nameService || !rate.price) {
                showMessage({ text: 'Todos los campos son requeridos.', type: 'error' });
                return;
            }
            const { data, status } = await createRate(token, rate);
            if (status !== 201 || !data) {
                showMessage({ text: 'No se pudo grabar el conductor, intente mas tarde', type: 'info' });
                return;
            }
            showMessage({ text: 'Conductor creado satisfactoriamente', type: 'success' })
            setRate(null);
            navigate('/prices');
        } catch (error) {
            showMessage({ text: 'No pudieron ser cargados los datos, intente mas tarde', type: 'error' })
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        try {
            setLoading(true);
            if (!rate || !rate.nameService || !rate.price) {
                showMessage({ text: 'Todos los campos son requeridos.', type: 'error' });
                return;
            }
            const { data, status } = await updateRate(token, rate);
            if (status !== 200 || !data) {
                showMessage({ text: 'Nada se Actualizo', type: 'info' });
                return;
            }
            showMessage({ text: 'Actualizado correctamente', type: 'success' });
            navigate('/prices');
        } catch (error) {
            console.log(error);
            showMessage({ text: 'Algo fallo, intentalo mas tarde', type: 'error' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{!isEdit ? 'Nuevo Tarifa' : 'Editar Tarifa'}</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos de Tarifa</h3>
                {!isLoading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="nameService"
                        value={rate?.nameService}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setRate({ ...rate, nameService: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Precio"
                        min={0}
                        name="price"
                        value={rate?.price}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setRate({ ...rate, price: e.target.value })}
                    />
                </div>}
            </div>

            {/* ✅ Botón de guardar */}
            {!isEdit ? <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
            >
                Guardar
            </button> :
                <div className="flex gap-4">
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Actualizar
                    </button>
                    <button
                        onClick={()=>navigate('/prices')}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Cancelar
                    </button>
                </div>}
        </div>
    )
}

export default RateForm