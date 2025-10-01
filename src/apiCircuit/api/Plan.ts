import type { IPlan, IResponseTaskCircuit, responsePlans } from '../interface/Plan';
import api from './axios';

export const getPlans = ({ pageToken, maxPageSize, startsGte, startsLte }:
    { pageToken?: string, maxPageSize?: number, startsGte?: string, startsLte?: string }) => {
    let query = pageToken ? `pageToken=${pageToken}&` : '';
    query += maxPageSize ? `maxPageSize=${maxPageSize}&` : '';
    query += startsGte ? `startsGte=${startsGte}&` : ''; //desde
    query += startsLte ? `startsLte=${startsLte}&` : ''; //hasta
    return api.get<responsePlans>(`/circuit/plans?${query}`);
}

export const createPlan = (planId: string) => {
    return api.get<IResponseTaskCircuit>(`/circuit/plans/create/${planId}`);
}

export const optimizePlan = (planId: string) => {
    return api.get<IResponseTaskCircuit>(`/circuit/plans/optimize/${planId}`);
}

export const sendPlanDrivers = (planId: string) => {
    return api.get<IResponseTaskCircuit>(`/circuit/plans/send/${planId}`);
}

export const getPlanByDay = ({ day, month, year }: { day: number, month: number, year: number }) => {
    return api.post<IPlan>('/circuit/plans/find', { day, month, year });
}
