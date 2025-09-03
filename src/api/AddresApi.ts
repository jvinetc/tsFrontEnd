import api from './axios';
type ResponseAutocomplete = {
    succes:boolean;
    data:{
        suggestions:[]
    };
    message:string,
    error:boolean,
}

type ResponseDetail = {
    succes:boolean;
    data:{
        addres:string;
        comuna:string,
        streetNumber:string;
        streetName:string;
        lat:string;
        lng:string;
    };
    message:string,
    error:boolean,
}
export const detailAddres =
    (placeId: string, token: string) => api.get<ResponseDetail>(`/autocomplete/detail/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
export const autocomplete = (textInput: string, token: string) =>
    api.post<ResponseAutocomplete>(`/autocomplete/${textInput}`, {
        headers: { Authorization: `Bearer ${token}` }
    });