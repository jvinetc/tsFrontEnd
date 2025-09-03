import api from './axios';
import type { responseChart, responsePays } from '../interface/Payment';

export const payChart = () => api.get<responseChart[]>('/pay/pays-chart');
export const paySellChart = () => api.get<responseChart[]>('/pay/sell-chart');

type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const getPays = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<responsePays>( `/pay?limit=${limit}&page=${page}${query}`, {
    headers: { Authorization: `Bearer ${token}` }
});}