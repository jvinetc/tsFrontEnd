import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import type { IStop } from '../interface/Stop';
import { useLoading } from '../context/LoadingContext';
import { createStop, getStopById, updateStop } from '../api/Stops';
import { useUser } from '../context/UserContext';
import AutocompleteDirection from './AutocompleteDirection';
import { detailAddres } from '../api/AddresApi';
import { listComunas } from '../api/Comunas';
import { useMessage } from '../context/MessageContext ';
import type { IComuna } from '../interface/Comuna';
import { listRates } from '../api/Rate';
import type { IRate } from '../interface/Rate';
import '../styles/Stop.css';
import type { ISell } from '../interface/Sell';
import { getSellByIdAdmin } from '../api/Sell';
type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};
const StopForm = () => {
    const { id, sellId } = useParams();
    const [stop, setStop] = useState<IStop | null | undefined>(null);
    const [sell, setSell] = useState<ISell | null | undefined>(null);
    const [rates, setRates] = useState<IRate[] | null | undefined>([]);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const phoneFormat = /^\+56\s?9\d{8}$|^569\d{8}$/i;
    const { showMessage } = useMessage();
    const [isEdit, setIsEdit] = useState(false);
    const { setLoading } = useLoading();
    const navigate = useNavigate();
    const { token } = useUser();
    useEffect(() => {
        const loadStop = async () => {
            if (!id) {
                return;
            }
            setLoading(true);
            try {
                setIsEdit(true);
                const { data } = await getStopById({ id: Number(id), token });
                setStop(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadStop();
    }, [])

    useEffect(() => {
        const loadStop = async () => {
            if (!sellId) {
                return;
            }
            setLoading(true);
            try {
                const { data } = await getSellByIdAdmin( Number(sellId), token );
                setSell(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadStop();
    }, [])

    useEffect(() => {
        const loadRate = async () => {
            setLoading(true);
            try {
                const { data } = await listRates(token);
                setRates(data);
            } catch (error) {
                console.log('Error al cargar tarifas:', error);
            } finally {
                setLoading(false);
            }
        }
        loadRate();
    }, [])

    const handleSelect = async (placeId: string) => {
        try {
            const { data } = await detailAddres(placeId, token);
            const { data: comunas } = await listComunas();
            const { addres, streetName, streetNumber, comuna, lat, lng } = data.data;
            if (!addres || !streetName || !streetNumber || !comuna || !lat || !lng) {
                setSuggestions([]);
                showMessage({ text: 'Debe ingresar una direccion valida', type: 'info' })
                return;
            }
            setBlockAutocomplete(true);
            setStop({ ...stop, addres: `${streetName} ${streetNumber}`, lat: Number(lat), lng: Number(lng) })
            const { id } = comunas.find(
                (comun: IComuna) => comun.name.trim() === comuna.trim()
            ) as IComuna;
            if (stop) {
                setStop({ ...stop, comunaId: id, lat: Number(lat), lng: Number(lng) });
            }
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        if (!sell)
            return showMessage({ text: 'Solo se pueden crear paradas directamnete desde el modulo de tiendas', type: 'info' })
        if (!stop || !stop.addresName || !stop.phone || !stop.addres || !stop.rateId) {
            showMessage({ text: 'Por favor completa todos los campos requeridos.', type: 'error' });
            console.log('No se ha completado el formulario');
            return;
        }
        if (!stop.phone.match(phoneFormat)) {
            showMessage({ text: 'El formato del teléfono es inválido.', type: 'error' });
            console.log('El formato del teléfono es inválido.');
            return;
        }
        setLoading(true);
        try {
            stop.sellId = Number(sellId);
            await createStop(stop, token);
            showMessage({ text: 'Parada creada exitosamente.', type: 'success' });
            setStop(null);
            navigate('/sells');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        if (!stop || !stop.addresName || !stop.phone || !stop.addres || !stop.rateId) {
            showMessage({ text: 'Por favor completa todos los campos requeridos.', type: 'error' });
            console.log('No se ha completado el formulario');
            return;
        }
        if (!stop.phone.match(phoneFormat)) {
            showMessage({ text: 'El formato del teléfono es inválido.', type: 'error' });
            console.log('El formato del teléfono es inválido.');
            return;
        }
        setLoading(true);
        try {
            await updateStop(stop, token);
            setStop(null);
            showMessage({ text: 'Parada actualizada exitosamente.', type: 'success' });
            navigate('/stops');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onCancel = () => {
        setIsEdit(false);
        showMessage({ text: 'Se cancelo la actualizacion.', type: 'info' });
        navigate('/stops');
    }

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Precaucion, {isEdit?'en esta seccion editara un punto.':
                `en esta seccion creara una parada para "${sell?.name}"`}</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos de Entrega</h3>
                <div className="grid grid-cols-1 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre y Apellido"
                        name="nameService"
                        value={stop?.addresName}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStop({ ...stop, addresName: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Telefono"
                        name="phone"
                        value={stop?.phone}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStop({ ...stop, phone: e.target.value })}
                    />
                    <AutocompleteDirection blockAutocomplete={blockAutocomplete}
                        data={stop} handleSelect={handleSelect} isEdit={true}
                        setBlockAutocomplete={setBlockAutocomplete} setData={setStop}
                        setSuggestions={setSuggestions} suggestions={suggestions} />
                    <input
                        type="text"
                        placeholder='Referencias(Depto/Torre/etc)'
                        name="notes"
                        value={stop?.notes}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStop({ ...stop, notes: e.target.value })}
                    />
                    <select value={stop?.rateId}
                        onChange={(e) => setStop({ ...stop, rateId: Number(e.target.value) })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value=''>Seleccione una tarifa...</option>
                        {rates?.map((r: IRate) => (
                            <option value={r.id} key={r.id}>{r.nameService}......{r.price}</option>
                        ))}

                    </select>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                        <label className="text-gray-700 dark:text-gray-200 font-medium">¿Es frágil?</label>
                        <input
                            type="checkbox"
                            checked={stop?.fragile}
                            onChange={(e) => setStop({ ...stop, fragile: e.target.checked })}
                            className="toggle-checkbox"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
                        <label className="text-gray-700 dark:text-gray-200 font-medium">¿Es devolución?</label>
                        <input
                            type="checkbox"
                            checked={stop?.devolution}
                            onChange={(e) => setStop({ ...stop, devolution: e.target.checked })}
                            className="toggle-checkbox"
                        />
                    </div>
                </div>
            </div>

            {/* ✅ Botón de guardar */}
            {!isEdit ?
                <div className='grid grid-cols-2 gap-4'>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Crear
                    </button>
                    <button
                        onClick={() => {
                            showMessage({ text: 'Se cancelo la creacion por parte de administrador.', type: 'info' });
                            setStop(null);
                            navigate('/sells');
                        }}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Cancelar
                    </button>
                </div>
                :
                <div className='grid grid-cols-2 gap-4'>
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Editar
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Cancelar
                    </button>
                </div>}

        </div>
    )
}

export default StopForm