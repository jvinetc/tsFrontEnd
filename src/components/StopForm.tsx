import { useEffect, useState } from 'react';
import {/*  useNavigate, */ useParams } from 'react-router-dom'
import type { IStop } from '../interface/Stop';
import { useLoading } from '../context/LoadingContext';
import { getStopById } from '../api/Stops';
import { useUser } from '../context/UserContext';
import AutocompleteDirection from './AutocompleteDirection';
import { detailAddres } from '../api/AddresApi';
import { listComunas } from '../api/Comunas';
import { useMessage } from '../context/MessageContext ';
import type { IComuna } from '../interface/Comuna';
type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};
const StopForm = () => {
    const { id } = useParams();
    const [stop, setStop] = useState<IStop | null | undefined>(null);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const { showMessage } = useMessage();
    const [isEdit, setIsEdit] = useState(false);
    const { setLoading } = useLoading();
    //const navigate = useNavigate();
    const { token } = useUser();
    useEffect(() => {
        const loadStop = async () => {
            if (!id) {
                setIsEdit(true);
                return;
            }
            setLoading(true);
            try {
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

    const handleSelect = async (placeId: string) => {
        try {
            const { data } = await detailAddres(placeId, token);
            const { data: comunas } = await listComunas(token);
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

    }

    const handleUpdate = async () => {

    }
    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Precaucion, en esta seccion editara un punto.</h2>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos de Entrega</h3>
                {stop && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="nameService"
                        value={stop?.addresName}
                        className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setStop({ ...stop, addresName: e.target.value })}
                    />
                    <AutocompleteDirection blockAutocomplete={blockAutocomplete}
                        data={stop} handleSelect={handleSelect} isEdit={true}
                        setBlockAutocomplete={setBlockAutocomplete} setData={setStop}
                        setSuggestions={setSuggestions} suggestions={suggestions} />
                </div>}
            </div>

            {/* ✅ Botón de guardar */}
            {!isEdit ? <button
                onClick={handleSubmit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
            >
                Crear
            </button> :
                <button
                    onClick={handleUpdate}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    Editar
                </button>}
        </div>
    )
}

export default StopForm