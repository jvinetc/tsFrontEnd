import type { ImagesData } from "./Images";
import type { IRole } from "./Role";
import type { ISell } from "./Sell";

export interface IUser {
    id?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    age?: number;
    username?: string;
    state?: string;
    image?: string;
    roleId?: number;
    createAt?: string;
    updateAt?: string;
    verification_token?: string;
    birthDate?: string;
    Sells?: ISell[];
    Rol?: IRole;
    Images?: ImagesData[];
}

export interface ILoginResponse{
    user: IUser;
    token:string
}
