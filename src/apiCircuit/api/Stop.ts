import type { ISyncResponse } from "../interface/Plan";
import type { IStopsResponse } from "../interface/Stop";
import api from "./axios";

export const getStops = ({ pageToken, maxPageSize, planId, externalId }:
    { pageToken?: string, maxPageSize?: number, planId: string, externalId?: string }) => {
    let query = pageToken ? `pageToken=${pageToken}&` : '';
    query += maxPageSize ? `maxPageSize=${maxPageSize}&` : '';
    query += externalId ? `externalId=${externalId}&` : '';
    query += planId ? `planId=${planId}/stops&` : '';
    return api.get<IStopsResponse>(`/circuit/stops?${query}`);
}

export const syncApp=()=>{
    return api.get<ISyncResponse>(`/circuit/stops/sync`);
}