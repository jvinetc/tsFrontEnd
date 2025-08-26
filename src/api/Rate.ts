import type { IRate, ResponseList } from "../interface/Rate";
import api from "./axios";

export const listRates = async (token: string) => {
    return await api.get<IRate[]>('/rate', {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const disableRate = async (token: string, id: number) => {
    return await api.put(`/rate/disable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const createRate = async (token: string, rate: IRate) => {
    return await api.post(`/rate`, rate, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const getRateById = async (token: string, id: number) => {
    return await api.get<IRate>(`/rate/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const updateRate = async (token: string, rate: IRate) => {
    return await api.put(`/rate`, rate, {
        headers: { Authorization: `Bearer ${token}` }
    });
}

type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const getRatesByAdmin = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/rate/byAdmin?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}
