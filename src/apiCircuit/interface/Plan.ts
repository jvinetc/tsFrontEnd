import type { IDriver } from "./DriverApi";

export interface IPlan {
    id?: number;
    id_router_api: string;
    title: string;
    drivers?: IDriver[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface responsePlans {
    plans: IPlan[];
    nextPageToken: string;
}

export interface ISyncResponse {
    message: string;
    plan:IPlan;
    pickups: boolean;
    deliveries: boolean;
    driversSincronizados: boolean;
}

export interface IResponseTaskCircuit {
    success?:{
        message?:string;
        planId?:string;
    }, 
    error?:{
        message?:string;
    }
}