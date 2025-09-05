import type { IDriver } from "./Driver";
import type { ISell } from "./Sell";
import type { IStop } from "./Stop";

export interface IPickUp {
    id?: number;
    sellId?: number;
    driverId?: number;
    stopId?: number;
    createAt?: Date;
    updateAt?: Date;
    Sell?: ISell | undefined | null;
    Driver?: IDriver | undefined | null;
    Stop?: IStop | undefined | null;
}

export interface responseChart {
    label?: string;
    value?: number;
}

export interface ResponseList{
    count:number;
    pickUp: IPickUp[] | undefined | null;
}