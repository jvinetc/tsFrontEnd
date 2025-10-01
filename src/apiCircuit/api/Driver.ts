import type { IResponseTaskCircuit } from '../interface/Plan';
import api from './axios';

export const syncDriversCircuit = () => {
    return api.get<IResponseTaskCircuit>('/circuit/drivers/sync');
}