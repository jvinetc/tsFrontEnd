import { IDepot } from "./Depot";

export interface IDriver{
    id?: number;
    id_router_api:string;
    name: string;
    email:string;
    phone:string;
    displayName:string;
    active:boolean;    
    depots?:IDepot[];
    createdAt?: Date;
    updatedAt?: Date;
}