import type { IComuna } from "./Comuna";
import type { IUser } from "./User";

export interface ISell{
    id?:number;
    name?: string;
    addres?: string;
    email?: string;
    addresPickup?: string;
    comunaId?: number;
    state?: string;
    userId?: number;
    lat?: number;
    lng?: number;
    createAt?: Date;
    updateAt?: Date;
    Comuna?: IComuna;
    User?:IUser;
}

export interface ResponseList{
    count:number;
    sells: ISell[] | undefined | null;
}