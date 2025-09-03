import { useEffect, useState } from 'react'
import type { INotification } from '../interface/Notification';
import { useLoading } from '../context/LoadingContext';
import { FiBell } from 'react-icons/fi';
import { getNotRead } from '../api/Notification';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const NotificationBell = () => {
    const [visible, setVisible] = useState(false);
    const [notifications, setNotifications] = useState<INotification[] | null | undefined>();
    const { setLoading } = useLoading()
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_SERVER;
    const socket = io(API_URL);

    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            try {
                const { data } = await getNotRead();
                setNotifications(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadNotifications();
        socket.on('admin', (data) => {
            console.log(data);
            loadNotifications();
        });

        return () => {
            socket.off('admin');
        };
        
    }, []);


    return (
        <div className="relative inline-block">
            <button
                onClick={() => setVisible(!visible)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onBlur={()=>setVisible(false)}
            >
                <FiBell className="text-xl text-gray-800 dark:text-white" />
                {notifications && notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                        {notifications.length}
                    </span>
                )}
            </button>

            {visible && (
                <div className="absolute mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-200">
                        📬 Notificaciones
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                        {notifications && notifications.length > 0 ? (
                            notifications.map((n, i) => (
                                <li key={i} onClick={() => {
                                    navigate('/profile');
                                    setVisible(false);
                                    setNotifications(null);
                                }} className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-800 dark:text-gray-100">{n.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                                </li>
                            ))
                        ) : (
                            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Sin notificaciones</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default NotificationBell