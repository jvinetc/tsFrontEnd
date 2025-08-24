import React, { useEffect, useState } from 'react'
import { useMessage } from '../context/MessageContext ';

const GlobalMessage = () => {
    const { message } = useMessage();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(!!message);
    }, [message]);

    if (!visible || !message) return null;

    const baseStyle = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white text-sm z-50 transition-all duration-300';
    const typeStyle = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600'
    };

    return (
        <div className={`${baseStyle} ${typeStyle[message.type || 'info']}`}>
            {message.text}
        </div>
    );
}

export default GlobalMessage