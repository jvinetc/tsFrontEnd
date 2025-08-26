
export interface IRate {
    id?: number,
    nameService?: string,
    price?:string,
    state?:string,
    createAt?: Date,
    updateAt?: Date,
}

export interface ResponseList{
    count:number;
    rates: IRate[] | undefined | null;
}