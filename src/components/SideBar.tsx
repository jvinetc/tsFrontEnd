import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, EnvelopeIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ImageButton from './ImageButton';
import NotificationBell from './NotificationBell';

type SideBarProps = {
    sidebarOpen: boolean;
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    setSidebarOpen: (value: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ sidebarOpen, darkMode, setDarkMode, setSidebarOpen }) => {
    const { isLoggedIn, user } = useUser();
    const [visible, setVisible] = useState<boolean>(false)
    const location = useLocation();
    const isActive = (path: string) =>
        location.pathname === path
            ? 'text-blue-600 font-semibold'
            : 'text-gray-700 dark:text-gray-300 hover:text-blue-500';
    return (
        <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static overflow-y-auto`}>
            {sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="absolute top-4 right-4 md:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Cerrar menú"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
            {!isLoggedIn ?
                <div className="p-2 flex flex-col items-center space-y-2">
                    <div className="flex items-end h-[8rem]">
                        <h1 className="text-[8rem] font-extrabold text-blue-600 leading-none">E</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">nvíos</p>
                    </div>
                    <div className="flex items-end h-[8rem]">
                        <h1 className="text-[8rem] font-extrabold text-blue-600 leading-none">T</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">odo</p>
                    </div>
                    <div className="flex items-end h-[8rem]">
                        <h1 className="text-[8rem] font-extrabold text-blue-600 leading-none">S</h1>
                        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300 ml-2 mb-1">antiago</p>
                    </div>
                </div>
                : <>
                    <div className="p-2 flex flex-col items-center space-y-2">
                        <ImageButton />
                        <div className="text-center">
                            <p className="font-semibold text-lg">{user?.firstName} {user?.lastName}</p>
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
                        <button
                            onClick={() => setVisible(!visible)}
                            className={`flex items-center justify-between w-full font-bold hover:text-blue-500 ${isActive('/circuit')}`}
                        >
                            <span>Modulo Circuit</span>
                            {visible ? (
                                <ChevronUpIcon className="h-5 w-5 text-blue-500" />
                            ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                        {visible &&
                            <div className="space-y-1 pl-4 mt-1 transition-all overflow-hidden">
                                <Link to="/circuit/home" className={`block text-sm hover:text-blue-500 ${isActive('/circuit/home')}`}>
                                    Home
                                </Link>
                                <Link to="/circuit/plans" className={`block text-sm hover:text-blue-500 ${isActive('/circuit/plans')}`}>
                                    Plans
                                </Link>
                            </div>}
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
                </div>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">© 2025 AppEnvios</p>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        aria-label="Cambiar tema"
                    >
                        {darkMode ? <SunIcon className="h-6 w-6 text-yellow-500" /> : <MoonIcon className="h-6 w-6 text-gray-600" />}
                    </button>
                </div>
            </div>
        </aside>
    )
}

export default SideBar