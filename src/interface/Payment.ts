import type { ISell } from "./Sell";
import type { IStop } from "./Stop";

export interface IPayment {
    id?: number;
    amount?: number;
    status?: string;
    vci?: string;
    buy_order?: string;
    session_id?: string;
    card_detail?: string;
    authorization_code?: string;
    createAt?: Date;
    sellId?: number;
    sessionId?: string;
    Sell: ISell | null | undefined;
}

export interface responseChart {
    label?: string;
    value?: number;
}

export interface responsePays {
    count: number;
    result: [{
        payment: IPayment;
        stops: IStop[];
    }]
}