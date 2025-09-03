import { useEffect, useState } from 'react'
import type { INotification } from '../interface/Notification';
import { useLoading } from '../context/LoadingContext';
import { getNotification, marckRead } from '../api/Notification';
import { useMessage } from '../context/MessageContext ';
import { useUser } from '../context/UserContext';

const Notifications = () => {
    const [read, setRead] = useState<INotification[] | undefined | null>();
    const [unRead, setUnread] = useState<INotification[] | undefined | null>();
    const [notifications, setNotifications] = useState<INotification[] | undefined | null>();
    const { isLoading, setLoading } = useLoading()
    const { token } = useUser();
    const { showMessage } = useMessage();
    const [activeTab, setActiveTab] = useState<'unread' | 'read'>('unread');
    useEffect(() => {
        const loadNotifications = async () => {
            setLoading(true);
            try {
                const { data, status } = await getNotification();
                if (status !== 200 || !data) {
                    showMessage({ text: 'Las notificaciones no pudieron ser cargadas', type: 'info' });
                    return;
                }
                setNotifications(data);
                setUnread(data.filter((n) => !n.read));
                setRead(data.filter((n) => n.read));
            } catch (error) {
                showMessage({ text: 'Las notificaciones no pudieron ser cargadas', type: 'error' });
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        loadNotifications();
    }, [!read])

    const markToRead = async (id: number) => {
        setLoading(true);
        try {
            await marckRead(id, token);
            setRead(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const renderList = (list: INotification[]) => (
        <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {list.map((n, i) => (
                <li
                    key={i}
                    className="border-l-4 border-blue-500 pl-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-md shadow-sm p-3"
                >
                    <p className="font-medium">{n.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {n.message}
                        {!n.read && (
                            <button
                                type="button"
                                onClick={() => markToRead(Number(n.id))}
                                className="ml-2 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-blue-600 transition-colors"
                            >
                                Marcar como leído
                            </button>
                        )}
                    </p>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b pb-2 mb-4">
                📬 Mensajes y Notificaciones
            </h3>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'unread'
                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    No leídos ({unRead && unRead.length})
                </button>
                <button
                    onClick={() => setActiveTab('read')}
                    className={`flex-1 py-2 text-sm font-medium ${activeTab === 'read'
                        ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                >
                    Leídos ({read && read.length})
                </button>
            </div>

            {/* Lista */}
            {!isLoading && notifications && notifications.length > 0 ? (
                activeTab === 'unread' ? renderList(unRead ?? []) : renderList(read ?? [])
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No tienes notificaciones pendientes.</p>
            )}
        </div>
    )
}

export default Notifications