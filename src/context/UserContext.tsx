import React, { createContext, useState, type ReactNode } from 'react'
import type { IUser } from '../interface/User';

interface UserContextType {
    user: IUser | undefined;
    setUser: (value: IUser | undefined) => void;
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void;
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
    token: string;
    setToken: (value: string) => void;
}
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | undefined>(undefined);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [token, setToken] = useState<string>('');
    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, isAdmin, setIsAdmin, token, setToken }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}