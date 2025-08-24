import type { ISell } from "../interface/Sell";
import type { IUser } from "../interface/User";
import api from "./axios";

export const createSell = (data: ISell, token: string) => 
  api.post('/sell', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const getSellById=(data: IUser, token: string) =>
    api.get(`/sell/${data.id}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const disableSell=(data: ISell, token: string) => 
    api.put('/sell/disable', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateSell=(data: ISell, token: string) => api.put('/sell', data, {
    headers: { Authorization: `Bearer ${token}` }
});