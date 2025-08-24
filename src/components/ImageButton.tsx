import React, { useRef, useState } from 'react'
import { useLoading } from '../context/LoadingContext';
import { uploadImage } from '../api/Images';
import { useUser } from '../context/UserContext';
import { useMessage } from '../context/MessageContext ';

const ImageButton = () => {

    const { setLoading } = useLoading();
    const { token, user, setUser } = useUser();
    const { showMessage } = useMessage();
    const API_URL = import.meta.env.VITE_SERVER;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const saveImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Vista previa
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Subida al backend
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const { data, status } = await uploadImage(formData, token, user);
            if (status !== 201 || !data) {
                showMessage({ text: 'La imagen no pudo ser guardada', type: 'info' });
                return;
            }
            setUser({ ...user, Images: [data.image] });
                showMessage({ text: 'Imagen guardada correctamente', type: 'success' });
                setPreview(null);
        } catch (err) {
            console.error('Error al subir imagen:', err);
             showMessage({ text: 'Error al cargar la imagen, intente mas tarde', type: 'error' });
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <div className="relative">
            <img
                src={
                    preview ||
                    (user?.Images?.length
                        ? `${API_URL}/uploads/${user.Images[0].name}`
                        : 'https://image.freepik.com/free-vector/delivery-logo-template_15146-141.jpg')
                }
                alt="Usuario"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
            />
            <button
                className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
            >
                ✎
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={saveImage}
            />

        </div>

    )
}

export default ImageButton