import type { IComuna } from "./Comuna";
import type { IDriver } from "./Driver";
import type { IPayment } from "./Payment";
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
    driverId?: number | null;
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
    Rate?: IRate | null | undefined;
    Sell?: ISell | null | undefined;
    Driver?:IDriver | null | undefined;
    Payment?:IPayment | null | undefined
}

export interface responseChart{
    label?:string;
    value?:number;
}

export interface ResponseList{
    count:number;
    stops: IStop[] | undefined | null;
}