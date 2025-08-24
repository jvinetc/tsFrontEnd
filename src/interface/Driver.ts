import type { IComuna } from "./Comuna";
import type { IUser } from "./User";

export interface IDriver {
    id?: number,
    userId?: number,
    patente?: string,
    permisoCirculacion?: string,
    revicionTecnica?: string,
    liceciaConducir?: string,
    status?: string,
    createAt?: Date,
    updateAt?: Date,
    User?: IUser | null | undefined;
    Comunas?: IComuna[] | null | undefined;
    vencimientoLiceciaConducir?: string;
    vencimientoPermisoCirculacion?: string;
    vencimientoRevicionTecnica?: string;
}
export interface ResponseList {
    drivers: IDriver[] | null | undefined; 
    count: number;
}