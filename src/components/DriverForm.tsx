import { useEffect, useState } from 'react'
import type { IDriver } from '../interface/Driver';
import type { IUser } from '../interface/User';
import type { IComuna } from '../interface/Comuna';
import { useLoading } from '../context/LoadingContext';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext ';
import { listComunas } from '../api/Comunas';
import { createDriver, getDriveById, updateDriver } from '../api/Driver';
import { useNavigate, useParams } from 'react-router-dom';

const DriverForm = () => {
  /*  type FilePreview = {
     name?: string;
     url?: string;
   }; */
  const [expirationPreview, setExpirationPreview] = useState<string[]>([]);
  const [driver, setDriver] = useState<IDriver | null>(null);
  const [driverPreview, setDriverPreview] = useState<IDriver | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [comunas, setComunas] = useState<IComuna[] | null>(null);
  const { isLoading, setLoading } = useLoading();
  const { token } = useUser();
  const { showMessage } = useMessage();
  const [file, setFile] = useState<File[]>([]);
  const [expiration, setExpiration] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  //const API_URL= import.meta.env.VITE_SERVER;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data, status } = await listComunas(token);
        if (status !== 200 || !data) {
          showMessage({ text: 'No pudieron ser cargados los datos, intente mas tarde', type: 'error' });
          return;
        }
        setComunas(data);

        if (id) {
          setIsEdit(true);
          await loadUser(Number(id));
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

  const loadUser = async (id: number) => {
    setLoading(true);
    try {
      const { data: d, status } = await getDriveById(Number(id), token)
      if (!d || status !== 200 || !d.liceciaConducir || !d.permisoCirculacion || !d.revicionTecnica
        || !d.vencimientoLiceciaConducir || !d.vencimientoPermisoCirculacion || !d.vencimientoRevicionTecnica
      ) return;
      setDriver(d);
      setDriverPreview(d);
      setUser(d.User ?? null);
      setExpirationPreview([d.vencimientoLiceciaConducir, d.vencimientoPermisoCirculacion, d.vencimientoRevicionTecnica]);
      setExpiration([d.vencimientoLiceciaConducir, d.vencimientoPermisoCirculacion, d.vencimientoRevicionTecnica]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }
  const handleDateChange = async (selectedDate: string) => {
    if (selectedDate) {
      const date = new Date(selectedDate);
      const ageLocal = Number(calculateAge(date));
      if (ageLocal < 18) {
        alert('Para registrarse debe tener mayoria de edad.');
        return;
      }
      const formattedDate = date.toISOString().split('T')[0];
      setUser({ ...user, age: ageLocal, birthDate: formattedDate });
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

  const handleSubmit = async () => {

    try {
      const formData = new FormData();
      setLoading(true);
      console.log(user, driver,file);
      if (!user || !user.firstName?.trim() || !user.lastName?.trim()
        || !user.email?.trim() || !driver || !driver.patente?.trim()
        || driver.Comunas?.length === 0 || !file || file.length < 3 ||
        !expiration || expiration.length < 3) {
        showMessage({ text: 'Todos los campos son requeridos.', type: 'error' });
        return;
      }
      file.forEach(f => formData.append("file", f));
      expiration?.forEach((e, i) => formData.append(`expiration${i + 1}`, e));
      formData.append('user', JSON.stringify(user));
      formData.append('driver', JSON.stringify(driver));
      /* for (const [key, value] of formData.entries()) {
        console.log(key, value);
      } */
      const { data, status } = await createDriver(token, formData);
      if (status !== 201 || !data) {
        showMessage({ text: 'No se pudo grabar el conductor, intente mas tarde', type: 'info' });
        return;
      }
      showMessage({ text: 'Conductor creado satisfactoriamente', type: 'success' })
      setFile([]);
      setUser(null);
      setDriver(null);
      navigate('/drivers');
    } catch (error) {
      showMessage({ text: 'No pudieron ser cargados los datos, intente mas tarde', type: 'error' })
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdate = async () => {
    const formData = new FormData();
    let val = 0;
    try {
      setLoading(true);
      if (driver !== driverPreview) {
        console.log("cambios en el conductor")
        val += 1;
        formData.append('driver', JSON.stringify(driver));
      }
      if (driver?.User !== user) {
        console.log('cambios en el usuario')
        formData.append('user', JSON.stringify(user));
        val += 1;
      }
      if (file.length > 0) {
        file.map((f, i) => {
          if (f && expiration[i] === expirationPreview[i]) {
            console.log('debes actualizar las fechas', i);
            showMessage({ text: 'Si cambias un archivo debes cambiar su fecha de vencimiento', type: 'info' });
            return;
          } else {
            formData.append(`expiration${i + 1}`, expiration[i])
            formData.append(`file${i + 1}`, f);
            val += 1;
          }
        })
      }
      if (val === 0) {
        showMessage({ text: 'Nada se Actualizo', type: 'info' });
        console.log('nada se actualizo');
        return;
      }
      const { data, status } = await updateDriver(token, formData, Number(driver?.id));
      if (status !== 200 || !data) {
        showMessage({ text: 'Nada se Actualizo', type: 'info' });
        return;
      }
      showMessage({ text: 'Actualizado correctamente', type: 'success' });
      navigate('/drivers');
    } catch (error) {
      console.log(error);
      showMessage({ text: 'Algo fallo, intentalo mas tarde', type: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">{!isEdit ? 'Nuevo Conductor' : 'Editar Conductor'}</h2>

      {/* 🧍 Datos personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos personales</h3>
        {!isLoading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="lastName"
            value={user?.lastName}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={user?.email}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Teléfono"
            name="phone"
            value={user?.phone}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            name="birthDate"
            value={user?.birthDate && new Date(user.birthDate).toISOString().split('T')[0]}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} // hoy
            min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => handleDateChange(e.target.value)}
          />
          <input
            type="text"
            placeholder="Patente"
            name="patente"
            value={driver?.patente}
            className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setDriver({ ...driver, patente: e.target.value })}
          />
        </div>}
      </div>

      {/* 🗺️ Comunas */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Comunas que cubre</h3>
        {comunas && <select
          multiple
          className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
            const selectedComunas = comunas.filter((c) => selectedIds.includes(c.id ?? 0));
            if (selectedComunas.length >0) {
              setDriver({ ...driver, Comunas: selectedComunas });
            }

          }}
        >
          {comunas.map((c) => {
            const selectedComunaIds = driver?.Comunas?.map(com => com.id) || [];
            return (<option key={c.id} value={c.id} selected={selectedComunaIds.includes(c.id)}>
              {c.name}
            </option>)
          })}
        </select>}
      </div>

      {/* 📄 Documentos */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Documentos</h3>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <input
              type="file"
              accept="application/pdf"
              name={`file${i}`}
              className="w-full md:w-auto text-gray-900 dark:text-white"
              onChange={(e) => {
                const selectedFile = e.currentTarget.files?.[0] || null;
                if (selectedFile) {
                  setFile((prev) => {
                    const updated = [...prev];
                    updated[i] = selectedFile;
                    return updated;
                  });
                }
              }}
            />
            <input
              type="date"
              value={expiration[i]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]} // hoy
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0]}
              className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const selectedDate = e.currentTarget.value;
                setExpiration((prev) => {
                  const updated = [...prev];
                  updated[i] = selectedDate;
                  return updated;
                });
              }}
            />
          </div>
        ))}
      </div>

      {/* ✅ Botón de guardar */}
      {!isEdit ? <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
      >
        Guardar
      </button> :
        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Actualizar
        </button>}
    </div>
  )
}

export default DriverForm