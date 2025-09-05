import type { IDriver, responseChart, ResponseList } from "../interface/Driver";
import api from "./axios";
type PropsQuery = {
    token: string, limit?: number, order?: string | '', page?: number, search?: string | ''
}
export const listDrivers = async ({ token, limit, order, page, search }: PropsQuery) => {
    let query: string = '';
    if (order) {
        query = `&order=${order}`;
    }
    if (search) {
        query += `&search=${search}`
    }
    return api.get<ResponseList>(`/driver?limit=${limit}&page=${page}${query}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
};
export const getDriveById = (id: number, token: string) => api.get<IDriver>(`/driver/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
})


export const createDriver = (token: string, driver: FormData) => api.post<IDriver>('/driver', driver, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
});

export const updateDriver = (token: string, driver: FormData, id: number) => api.put(`/driver/${id}`, driver, {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
    }
});

export const disableDriver = (token: string, id: number) => api.put('/driver/disable', { id }, {
    headers: { Authorization: `Bearer ${token}` }
});

export const getDeliveredChart = (token: string) => api.get<responseChart[]>('/driver/getDeliveredChart', {
    headers: { Authorization: `Bearer ${token}` }
})