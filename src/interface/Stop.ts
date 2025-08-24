import type { IComuna } from "./Comuna";
import type { IRate } from "./Rate";
import type { ISell } from "./Sell";

export interface IStop {
    id?: number;
    addresName?: string;
    addres?: string;
    phone?: string;
    notes?: string;
    buyOrder?: string;
    sellId?: number;
    driverId?: number;
    comunaId?: number;
    rateId?: number;
    status?: string;
    fragile?: boolean;
    devolution?: boolean;
    lat?: number;
    lng?: number;
    createAt?: Date;
    updateAt?: Date;
    Comuna?: IComuna;
    Rate?: IRate;
    Sell?: ISell;

}

export interface responseChart{
    label?:string;
    value?:number;
}