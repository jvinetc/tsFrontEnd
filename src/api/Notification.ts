import api from './axios';
import type { INotification } from '../interface/Notification';


export const getNotification = () => api.get<INotification[]>('/notification/byAdmin');
export const getNotRead = () => api.get<INotification[]>('/notification/notRead');
export const marckRead = (id: number, token: string) => api.put(`/notification/read/${id}`,{}, {
    headers: { Authorization: `Bearer ${token}` }
});