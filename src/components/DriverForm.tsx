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
import ComunasSelector from './ComunasSelector';

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
  const [file, setFile] = useState<(File | null)[]>([]);
  const [expiration, setExpiration] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  //const API_URL= import.meta.env.VITE_SERVER;
  const placeholderFiles = ['Licencia de Conducir.pdf', 'Revision Tecnica.pdf', 'Permiso de Circulacion.pdf'];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data, status } = await listComunas();
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
      if (!user || !user.firstName?.trim() || !user.lastName?.trim()
        || !user.email?.trim() || !driver || !driver.patente?.trim()
        || driver.Comunas?.length === 0 || !file || file.length < 3 ||
        !expiration || expiration.length < 3) {
        showMessage({ text: 'Todos los campos son requeridos.', type: 'error' });
        return;
      }
      file.forEach(f => { if (f) formData.append("file", f); });
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
        file.forEach((f, i) => {
          if (!f) return;
          if (expiration[i] === expirationPreview[i]) {
            console.log('debes actualizar las fechas', i);
            showMessage({ text: 'Si cambias un archivo debes cambiar su fecha de vencimiento', type: 'info' });
            return;
          } else {
            formData.append(`expiration${i + 1}`, expiration[i]);
            formData.append(`file${i + 1}`, f);
            val += 1;
          }
        });
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
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
        {!isEdit ? 'Nuevo Conductor' : 'Editar Conductor'}
      </h2>

      {/* 🧍 Datos personales */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Datos personales</h3>
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'firstName', placeholder: 'Nombre' },
              { name: 'lastName', placeholder: 'Apellido' },
              { name: 'email', placeholder: 'Email', type: 'email' },
              { name: 'phone', placeholder: 'Teléfono' },
            ].map(({ name, placeholder, type = 'text' }) => (
              <input
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={user?.firstName || ''}
                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              />
            ))}

            <input
              type="date"
              name="birthDate"
              placeholder="Fecha de nacimiento"
              value={user?.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : ''}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleDateChange(e.target.value)}
            />

            <input
              type="text"
              name="patente"
              placeholder="Patente"
              value={driver?.patente || ''}
              className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setDriver({ ...driver, patente: e.target.value })}
            />
          </div>
        )}
      </section>

      {/* 🗺️ Comunas */}
      {!isLoading && (
        <section>
          <ComunasSelector comunas={comunas} driver={driver} setDriver={setDriver} />
        </section>
      )}

      {/* 📄 Documentos */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-1">Documentos</h3>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* <input
              type="file"
              accept="application/pdf"
              name={`file${i}`}
              className="w-full md:w-auto text-gray-900 dark:text-white"
              placeholder={placeholderFiles[i]}
              alt={placeholderFiles[i]}
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
            /> */}
            <div className="space-y-2">
              <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
                {file[i]?.name || placeholderFiles[i] || 'Subir documento PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  name={`file${i}`}
                  className="hidden"
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
              </label>

              {/* Mostrar nombre del archivo si está cargado */}
              {file[i] && (
                <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
                  <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                    <span>📄</span>
                    <span className="text-sm">{file[i].name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setFile((prev) => {
                        const updated = [...prev];
                        updated[i] = null;
                        return updated;
                      });
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
            <input
              type="date"
              value={expiration[i]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().split('T')[0]}
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
      </section>

      {/* ✅ Botón de acción */}
      {!isEdit ? (
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Guardar
        </button>
      ) : (
        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Actualizar
          </button>
          <button
            onClick={() => navigate('/drivers')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}

export default DriverForm