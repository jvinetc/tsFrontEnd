import type { IComuna } from "../interface/Comuna";
import api from "./axios";

export const listComunas = () => api.get<IComuna[]>('/comuna');
export const setComuna = (data:IComuna[], token:string) => api.post('/comuna', data, {
    headers: { Authorization: `Bearer ${token}` }
});