import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_SERVER;

  const InfoCard = ({ label, value }: { label: string; value?: string }) => (
    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow">
      <p className="text-sm text-gray-500 dark:text-gray-300">{label}</p>
      <p className="text-lg font-semibold text-gray-800 dark:text-white">{value || '—'}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4">
        <img
          src={user?.Images && user?.Images?.length > 0 ? user?.Images[0].url : '/default-avatar.png'}
          alt="Foto de perfil"
          className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user?.firstName} {user?.lastName}</h2>
          <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
        </div>
      </div>

      {/* Información detallada */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard label="Teléfono" value={user?.phone} />
        <InfoCard label="Rol" value={user?.Role?.name} />
        <InfoCard label="Estado" value={user?.state} />
      </div>

      {/* Notificaciones */}
      {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">📬 Mensajes y Notificaciones</h3>
        {notifications.length > 0 ? (
          <ul className="space-y-2">
            {notifications.map((n, i) => (
              <li key={i} className="border-l-4 border-blue-500 pl-3 text-gray-700 dark:text-gray-300">
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{n.message}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No tienes notificaciones pendientes.</p>
        )}
      </div> */}
    </div>
  )
}

export default Profile