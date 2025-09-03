import Notifications from '../components/Notifications';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user } = useUser();

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
        <div className='grid gap-4'>
          <InfoCard label="Teléfono" value={user?.phone} />
          <InfoCard label="Rol" value={user?.Role?.name} />
          <InfoCard label="Estado" value={user?.state} />
        </div>
        <Notifications />
      </div>

    </div>
  )
}

export default Profile