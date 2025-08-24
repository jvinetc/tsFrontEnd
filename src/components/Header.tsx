import React from 'react'
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

type HeaderProps={
    sidebarOpen: boolean;
    setSidebarOpen: (value:boolean)=>void;
    darkMode:boolean;
    setDarkMode: (value:boolean)=>void;
}

const Header: React.FC<HeaderProps> = ({sidebarOpen, setSidebarOpen, darkMode, setDarkMode}) => {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 shadow-md md:ml-64">
            <div className="md:hidden">
                <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                </button>
            </div>
            <h1 className="text-xl font-semibold">Envios Todo Santiago</h1>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
        </header>
    )
}

export default Header