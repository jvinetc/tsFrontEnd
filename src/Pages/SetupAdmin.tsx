import { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';
import type { IComuna } from '../interface/Comuna';
import { listComunas } from '../api/Comunas';
import { useMessage } from '../context/MessageContext ';
import type { ICreateAdmin } from '../interface/User';
import { createUser } from '../api/User';
/* import path from 'path';
import * as fs from 'fs'; */

const SetupAdmin = ({ onComplete }: { onComplete: () => void }) => {
    const [form, setForm] = useState<ICreateAdmin>({
        email: '',
        pass: '',
        firstName: '',
        lastName: '',
        phone: '',
        age: 0,
        username: '',
        birthDate: '',
        sellName: '',
        addres: '',
        comunaId: ''
    });
    const [comunas, setComunas] = useState<IComuna[]>()
    const { isLoading, setLoading } = useLoading();
    const [error, setError] = useState('');
    const { showMessage } = useMessage()

    useEffect(() => {
        const loadComunas = async () => {
            try {
                const { data } = await listComunas();
                setComunas(data);
            } catch (error) {
                console.log(error);
            }
        }
        loadComunas();
    }, []);
   /*  const configPath = path.join(app.getPath('userData'), 'admin.json');
    const saveAdminLocally = (adminData: ICreateAdmin) => {
        fs.writeFileSync(configPath, JSON.stringify(adminData, null, 2));
    } */
    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        if (!form || !form.firstName?.trim() || !form.lastName?.trim()
            || !form.email?.trim() || !form.addres?.trim() || !form.comunaId?.trim()
            || !form.sellName?.trim() || !form.username?.trim() || form.age === 0
            || !form.birthDate?.trim()) {
            showMessage({ text: 'Todos los campos son requeridos.', type: 'error' });
            return;
        }
        try {
            const { data, status } = await createUser(form);
            if (status !== 201) {
                /* saveAdminLocally(form); */
                showMessage({ text: 'No pudo realizarse el registro, intente mas tarde.', type: 'error' });
                return;
            }
            console.log('✅ Admin registrado:', data);
            // Guardar flag local para no mostrar setup otra vez
            localStorage.setItem('setupCompleted', 'true');
            onComplete();
        } catch (err) {
            console.error('❌ Error al registrar:', err);
            setError('No se pudo registrar el administrador. Verifica los datos.');
        } finally {
            setLoading(false);
        }
    };
    const handleDateChange = async (selectedDate: string) => {
        if (selectedDate) {
            const date = new Date(selectedDate);
            const ageLocal = Number(calculateAge(date));
            if (ageLocal < 18) {
                alert('Para registrarse debe tener mayoria de edad.');
                return;
            }
            const formattedDate = date.toISOString().split('T')[0];
            setForm({ ...form, age: ageLocal, birthDate: formattedDate });
        }
    }

    const calculateAge = (birthDate: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="setup-container max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Configuración inicial</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Completa los datos para registrar al administrador y su negocio.</p>

            {/* Datos del administrador */}
            <fieldset className="mb-6">
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">👤 Datos del administrador</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="firstName" placeholder="Nombre" value={form.firstName}
                        onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                        className="input" />
                    <input type="text" name="lastName" placeholder="Apellido" value={form.lastName}
                        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                        className="input" />
                    <input type="text" name="phone" placeholder="Teléfono" value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input" />
                    <input type="text" name="username" placeholder="Nombre de usuario" value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="input" />
                    <input type="date" name="birthDate"
                        value={form.birthDate && new Date(form.birthDate).toISOString().split('T')[0]}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="input" />
                </div>
            </fieldset>

            {/* Datos del negocio */}
            <fieldset className="mb-6">
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">🏪 Datos del negocio</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="sellName" placeholder="Nombre del negocio" value={form.sellName}
                        onChange={(e) => setForm({ ...form, sellName: e.target.value })}
                        className="input" />
                    <input type="text" name="addres" placeholder="Dirección" value={form.addres}
                        onChange={(e) => setForm({ ...form, addres: e.target.value })}
                        className="input" />
                    <select name="comunaId" value={form.comunaId}
                        onChange={(e) => setForm({ ...form, comunaId: e.target.value })}
                        className="input">
                        <option value="">Selecciona una comuna</option>
                        {comunas?.map((comuna, index) => (
                            <option key={index} value={comuna.id}>{comuna.name}</option>
                        ))}
                    </select>
                </div>
            </fieldset>

            {/* Datos de sesión */}
            <fieldset className="mb-6">
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">🔐 Datos de sesión</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="email" name="email" placeholder="Correo electrónico" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input" />
                    <input type="password" name="password" placeholder="Contraseña" value={form.pass}
                        onChange={(e) => setForm({ ...form, pass: e.target.value })}
                        className="input" />
                </div>
            </fieldset>

            {/* Error y botón */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button onClick={handleSubmit} disabled={isLoading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50">
                {isLoading ? 'Registrando...' : 'Registrar administrador'}
            </button>
        </div>
    );
};

export default SetupAdmin;