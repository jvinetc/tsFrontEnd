import type { IPickUp, responseChart, ResponseList } from '../interface/PickUp';
import api from './axios';

type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const getPickUps = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/pickUp?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const createPickUp = ({ token, data }: { token: string, data: IPickUp }) => api.post('/pickUp', data, {
    headers: { Authorization: `Bearer ${token}` }
});

export const chartPickUps = (token: string) => api.get<responseChart[]>('/pickUp/pickup-chart', {
    headers: { Authorization: `Bearer ${token}` }
});