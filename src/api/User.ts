import type { ILoginResponse, IUser } from '../interface/User';
import api from './axios';

export const login = (data: IUser) =>
    api.post<ILoginResponse>('/user/login',
        { email: data.email, password: data.password });
export const register = (data: IUser) =>
    api.post('/user/register', data);
export const disable = (data: IUser, token:string) =>
    api.put('/user/disable', { id: data.id },
        {
    headers: { Authorization: `Bearer ${token}` }
}    );
export const update = (data: IUser, token: string) =>
    api.put('/', data, {
        headers: { Authorization: `Bearer ${token}` }
    })
    export const createUser = (data:IUser, token:string )=> api.post<IUser>('/user', data, {
        headers: { Authorization: `Bearer ${token}` }
    })