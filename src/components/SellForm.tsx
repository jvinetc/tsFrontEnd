import { useEffect, useState } from 'react'
import { useLoading } from '../context/LoadingContext';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext ';
import { useNavigate, useParams } from 'react-router-dom';
import { createSellAdmin, getSellByIdAdmin, updateSell } from '../api/Sell';
import type { ISell } from '../interface/Sell';
import type { IUser } from '../interface/User';
import AutocompleteDirection from './AutocompleteDirection';
import { detailAddres } from '../api/AddresApi';
import { listComunas } from '../api/Comunas';
import type { IComuna } from '../interface/Comuna';
import { update } from '../api/User';

type Suggestion = {
    placePrediction: {
        placeId: string;
        text: {
            text: string;
        };
    };
};

const SellForm = () => {
    const { isLoading, setLoading } = useLoading();
    const { token } = useUser();
    const { showMessage } = useMessage();
    const [sell, setSell] = useState<ISell | null | undefined>();
    const [user, setUser] = useState<IUser>();
    const [isEdit, setIsEdit] = useState(false);
    const [blockAutocomplete, setBlockAutocomplete] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadSell = async () => {
            if (!id) {
                return;
            }
            setLoading(true)
            try {
                setIsEdit(true);
                const { data } = await getSellByIdAdmin(Number(id), token);
                if (!data) return showMessage({ text: 'No fue posible cargar la tienda' });
                setSell(data);
                setUser(data.User);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadSell();
    }, []);

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
            const { id } = comunas.find(
                (comun: IComuna) => comun.name.trim() === comuna.trim()
            ) as IComuna;
            if (sell) {
                setSell({ ...sell, addres: `${streetName} ${streetNumber}`, addresPickup: `${streetName} ${streetNumber}`, comunaId: id, lat: Number(lat), lng: Number(lng) });
            }
            setSuggestions([]);
        } catch (error) {
            console.log(error)
        }
    }

    const handleSubmit = async () => {
        console.log('user:',user)
        console.log('sell:',sell)
        if (!user || !user.firstName ||
            !user.lastName || !user.email || !user.phone ||
            !sell || !sell.name || !sell.addres || !sell.email) {
            showMessage({ text: 'Los campos deben estar completos', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await createSellAdmin({ user, sell }, token);
            showMessage({ text: `La tienda fue creada satisfactoriamente, se envio un correo a ${user.email} con su password provisional`, type: 'success' });
            navigate('/sells');
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleUpdate = async () => {
        if (!user || !user.firstName ||
            !user.lastName || !user.email || !user.phone ||
            !sell || !sell.name || !sell.addres || !sell.email) {
            showMessage({ text: 'Los campos deben estar completos', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            await updateSell(sell, token);
            await update(user, token);
            showMessage({ text: 'Tienda actualizada correctamente.', type: 'success' });
            navigate('/sells');
        } catch (error) {
            showMessage({ text: 'No fue posible realizar la accion, intente mas tarde.', type: 'error' });
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const onCancel = () => {
        showMessage({ text: 'La operacion fue cancelada.', type: 'info' })
        navigate('/sells');
    }

    return (
        <div className="p-4 space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
            {!isLoading && <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{!isEdit ? 'Precuacion, esta a punto de crear una Tienda' :
                `Precuacion, editara la tienda "${sell?.name}".`}</h2>}

            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos de representante</h3>
                {!isLoading &&
                    <div className="grid grid-cols-1  gap-4">
                        <div className="grid grid-cols-2  gap-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="firstName"
                                value={user?.firstName}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Apellido"
                                min={0}
                                name="lastName"
                                value={user?.lastName}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Telefono"
                                name="phone"
                                value={user?.phone}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                min={0}
                                name="email"
                                value={user?.email}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                            />
                        </div>

                    </div>}
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos de la tienda</h3>
                {!isLoading &&
                    <div className="grid grid-cols-1  gap-4">
                        <div className="grid grid-cols-2  gap-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                name="name"
                                value={sell?.name}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setSell({ ...sell, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Email"
                                name="email"
                                value={sell?.email}
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => setSell({ ...sell, email: e.target.value })}
                            />
                            <AutocompleteDirection blockAutocomplete={blockAutocomplete}
                                data={sell} handleSelect={handleSelect} isEdit={true}
                                setBlockAutocomplete={setBlockAutocomplete} setData={setSell}
                                setSuggestions={setSuggestions} suggestions={suggestions} />
                        </div>

                    </div>}
            </div>

            {/* ✅ Botón de guardar */}
            <div className='grid grid-cols-2 gap-4'>
                {!isEdit ?

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Guardar
                    </button>

                    :
                    <button
                        onClick={handleUpdate}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                    >
                        Actualizar
                    </button>

                }
                <button
                    onClick={onCancel}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    Cancelar
                </button>
            </div>
        </div >
    )
}

export default SellForm