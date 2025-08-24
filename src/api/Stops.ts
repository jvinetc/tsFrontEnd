import type { IStop, responseChart } from '../interface/Stop';
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
export const getPays = (sellId:number, token:string) => api.get(`/stop/pays/${sellId}`, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getPayDetail = (buyOrder?:string, token?:string) => api.get(`/stop/pays/detail/${buyOrder}`, {
    headers: { Authorization: `Bearer ${token}` }
});
export const downloadTemplate = (token: string) => api.get(`/stop/downloadTemplate`, {
    headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
});

export const listStops = ()=>api.get('/stop');
export const listStopChart=()=>api.get<responseChart[]>('/stop/chart');
export const listStopsComunas= ()=>api.get<responseChart[]>('/stop/chart/comuna');