import React, { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ImageButton from './ImageButton';
import NotificationBell from './NotificationBell';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { getSideBarItems } from '@jvinetc/front-api-circuit'
//import '@jvinetc/front-api-circuit/dist/front-api-circuit.css';

type SideBarProps = {
    sidebarOpen: boolean;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, darkMode, setDarkMode }) => {
    const { isLoggedIn, user } = useUser();
    const location = useLocation();
    const items = getSideBarItems();
    const isActive = (path: string) =>
        location.pathname.startsWith(path)
            ? 'text-blue-600 font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-500';
    /* seccion de circuit */
    const [openMenus, setOpenMenus] = useState<boolean>(false);

    const toggleMenu = () => {
        setOpenMenus(prev => !prev);
    };
    /* fin seccion de circuit */
    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
            {!isLoggedIn ?
                <div className="p-4 flex flex-col items-center space-y-2">
                    <div className="flex items-end h-[7rem]">
                        <h1 className="text-[7rem] font-extrabold text-blue-600 leading-none">E</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">nvíos</p>
                    </div>
                    <div className="flex items-end h-[8rem]">
                        <h1 className="text-[7rem] font-extrabold text-blue-600 leading-none">T</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">odo</p>
                    </div>
                    <div className="flex items-end h-[8rem]">
                        <h1 className="text-[7rem] font-extrabold text-blue-600 leading-none">S</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">antiago</p>
                    </div>
                </div>
                : <>
                    <div className="p-4 flex flex-col items-center space-y-2">
                        <ImageButton />
                        <div className="text-center">
                            <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}`</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.Role?.name?.toUpperCase()}</p>
                            <Link to="/logout" className="block hover:text-blue-200">Cerrar sesion</Link>
                        </div>
                        <NotificationBell />
                    </div>
                    <nav className="p-2 space-y-2">
                        <Link to="/" className={`block hover:text-blue-500 ${isActive('/')}`}>Inicio</Link>
                        <Link to="/profile" className={`block hover:text-blue-500 ${isActive('/profile')}`}>Perfil</Link>
                        <Link to="/drivers" className={`block hover:text-blue-500 ${isActive('/drivers')}`}>Conductores</Link>
                        <Link to="/sells" className={`block hover:text-blue-500 ${isActive('/sells')}`}>Tiendas</Link>
                        <Link to="/stops" className={`block hover:text-blue-500 ${isActive('/stops')}`}>Puntos</Link>
                        <Link to="/prices" className={`block hover:text-blue-500 ${isActive('/prices')}`}>Tarifas</Link>
                        <Link to="/payments" className={`block hover:text-blue-500 ${isActive('/payments')}`}>Pagos recibidos</Link>
                        <Link to="/pickups" className={`block hover:text-blue-500 ${isActive('/pickups')}`}>Registro de Retiros</Link>
                        {items.map(({ label, path, children }) => (
                            <div key={path}>
                                <Link to={path} onClick={() => toggleMenu()} className={`block font-semibold hover:text-blue-500 ${isActive(path)}`}>
                                    {label}
                                </Link>

                                {openMenus ? children && (
                                    <div className="ml-4 mt-1 space-y-1">
                                        {children.map(({ label: childLabel, path: childPath }) => (
                                            <Link
                                                key={childPath}
                                                to={childPath}
                                                className={`block text-sm hover:text-blue-400 ${isActive(childPath)}`}
                                            >
                                                {childLabel}
                                            </Link>
                                        ))}
                                    </div>
                                ) : ''}
                            </div>
                        ))}
                    </nav>
                </>}
            {/* Redes sociales y contacto */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-center space-x-4 mb-2">
                    <Link to="https://github.com/jvinetc" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
                        <FaGithub className='h-6 w-6' />
                    </Link>
                    <Link to="mailto:jvinetc@gmail.com" className="text-gray-500 hover:text-blue-500">
                        <EnvelopeIcon className="h-6 w-6" />
                    </Link>
                    <Link to="https://linkedin.com/in/jvinetc" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
                        <FaLinkedin className='h-6 w-6' />
                    </Link>
                    <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                        {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                    </button>
                </div>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">© 2025 AppEnvios</p>

            </div>
        </aside>
    )
}

export default SideBar