import { useState } from 'react';
import SideBar from './SideBar';
//import Header from './Header';
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="fixed top-4 right-4 z-50 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            aria-label="Abrir menú"
          >
            <svg
              className="h-6 w-6 text-gray-800 dark:text-gray-100"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {/*  <Header darkMode={darkMode} setDarkMode={setDarkMode} setSidebarOpen={setSidebarOpen} sidebarOpen/> */}

          {/* Content */}
          <main className="p-4 overflow-y-auto"><Outlet /></main>
        </div>
      </div>
    </div>
  )
}

export default Layout