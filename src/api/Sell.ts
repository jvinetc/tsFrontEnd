import type { ISell, ResponseList } from "../interface/Sell";
import type { IUser } from "../interface/User";
import api from "./axios";

export const createSell = (data: ISell, token: string) =>
    api.post('/sell', data, {
        headers: { Authorization: `Bearer ${token}` }
    });

type SellAdmin = {
    sell: ISell;
    user: IUser;
}
export const createSellAdmin = (body: SellAdmin, token: string) =>
    api.post('/sell/createAdmin', body, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getSellById = (data: IUser, token: string) =>
    api.get(`/sell/${data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const getSellByIdAdmin = (sellId: number, token: string) =>
    api.get<ISell>(`/sell/admin/${sellId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const disableSell = (data: ISell, token: string) =>
    api.put('/sell/disable', data, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const updateSell = (data: ISell, token: string) => api.put('/sell', data, {
    headers: { Authorization: `Bearer ${token}` }
});


type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const getSells = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/sell?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}