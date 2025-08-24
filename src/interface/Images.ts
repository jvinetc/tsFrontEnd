export interface ImagesData {
    id?: number;
    name?: string;
    userId?: number;
    stopId?: number;
    createAt?: Date;
    updateAt?: Date;
}

export interface ImageResponse{
    image:ImagesData;
}