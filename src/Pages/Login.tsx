import { useState } from 'react'
import type { IUser } from '../interface/User';
import { useLoading } from '../context/LoadingContext';
import { login } from '../api/User';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../context/MessageContext ';

const Login = () => {

  const [userLogin, setUserLogin] = useState<IUser | null>(null);
  const { isLoading, setLoading } = useLoading();
  const [error, setError] = useState('');
  const { setUser, setIsLoggedIn, setIsAdmin, setToken } = useUser();
  const {showMessage} = useMessage();
  const navigate=useNavigate();

  const handleLogin = async ()=> {
    setLoading(true);
    setError('');
    try {
      if (!userLogin || !userLogin.password || !userLogin.email) {
        showMessage({ text: 'Los campos no deben estar vacios', type: 'info' });
        return;
      }
      const { data , status } = await login(userLogin);
      if (status !== 200 || !data?.user || !data?.token) {
        showMessage({ text: 'Usuario o contraseña equivocadas', type: 'error' });
        return;
      }
      if(data.user.Rol?.name ==='admin'){setIsAdmin(true)}
      setUser(data.user);
      setToken(data.token);
      sessionStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/'); 
    } catch(error) {
      console.log(error)
      showMessage({ text: 'Error al iniciar sesion, intente mas tarde', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Iniciar sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={userLogin?.email}
          onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
          className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={userLogin?.password}
          onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
          className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {isLoading ? 'Cargando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

export default Login