import { useState } from 'react';
import SideBar from './SideBar';
//import Header from './Header';
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen,/*  setSidebarOpen */] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {/* Sidebar */}
        <SideBar sidebarOpen={sidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode}/>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
        {/*  <Header darkMode={darkMode} setDarkMode={setDarkMode} setSidebarOpen={setSidebarOpen} sidebarOpen/> */}

          {/* Content */}
          <main className="p-4 overflow-y-auto"><Outlet/></main>
        </div>
      </div>
    </div>
  )
}

export default Layout