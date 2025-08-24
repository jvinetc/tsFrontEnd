import type { ImageResponse } from "../interface/Images";
import type { IUser } from "../interface/User";
import api from "./axios";

export const uploadImage = (data: FormData, token: string, user: IUser | undefined) => api.post<ImageResponse>(`/image/user/${user?.id}`, data, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data"
  }
});
