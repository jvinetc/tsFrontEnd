import type { IStop, responseChart, ResponseList } from '../interface/Stop';
import type { IUser } from '../interface/User';
import api from './axios';

export const uploadExcel = (data: FormData, token: string, sellId?: number) => api.post(`/stop/uploadExcel/${sellId}`, data, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
    }
});
export const pay = (data: IStop[] | null, amount: number, sessionId: string, returnUrl: string, token: string) => api.post('/stop/pay', { selectedStops: data, amount, sessionId, returnUrl }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const createStop = (data: IStop, token: string) => api.post('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const listStopByUser = (data: IUser, token: string) => api.get(`/stop/${data.Sells?.length !== undefined ? data.Sells[0].id : ''}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const disableStop = (data: IStop, token: string) => api.put('/stop/disable', { id: data.id }, {
    headers: { Authorization: `Bearer ${token}` }
});
export const updateStop = (data: IStop, token: string) => api.put('/stop', data, {
    headers: { Authorization: `Bearer ${token}` }
});
export const getPays = (sellId: number, token: string) => api.get(`/stop/pays/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getPayDetail = (buyOrder?: string, token?: string) => api.get(`/stop/pays/detail/${buyOrder}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const downloadTemplate = (token: string) => api.get(`/stop/downloadTemplate`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
});

export const listStops = (token: string) => api.get<IStop[]>('/stop', {
    headers: { Authorization: `Bearer ${token}` }
});
export const listStopChart = (token: string) => api.get<responseChart[]>('/stop/chart', {
    headers: { Authorization: `Bearer ${token}` }
});
export const listStopsComunas = (token: string) => api.get<responseChart[]>('/stop/chart/comuna', {
    headers: { Authorization: `Bearer ${token}` }
});

type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const listStopsByAdmin = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/stop/byAdmin?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export const asignDriver = (token: string) => api.post('/stop/asignDriver', {}, {
    headers: { Authorization: `Bearer ${token}` }
})

export const getStopById = ({ token, id }: { token: string, id: number }) => api.get<IStop>(`/stop/stop/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getStopsPending = (token: string) => api.get<IStop[]>('/stop/pending', {
    headers: { Authorization: `Bearer ${token}` }
});

export const getStopsDelivered = ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/stop/delivered?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
}