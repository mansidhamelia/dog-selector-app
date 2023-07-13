
import React, { useState, createContext } from "react";
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
    isLoggedIn: boolean;
    onLogin: (name: string, email: string) => Promise<void>;
    onLogout: () => void;
}

const baseURL = 'https://frontend-take-home-service.fetch.com';

const AuthContext = createContext<AuthContextProps>({
    isLoggedIn: false,
    onLogin: async (name: string, email: string) => { },
    onLogout: () => { }
});
export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const response = await fetch(`${baseURL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (response.ok) {
                setIsLoggedIn(false);
                navigate('/')
            } else {
                console.log('Logout failed');
            }
        } catch (error) {
            console.log('Error during logout:', error);
        }
    };

    const loginHandler = async (name: string, email: string) => {

        try {
            const response = await fetch(`${baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email }),
                credentials: 'include',
            });

            if (response.ok) {
                setIsLoggedIn(true)
                navigate('/doglist');
            } else {
                console.error('Login failed!');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
        }
    }
    return <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler }}>{props.children}</AuthContext.Provider>
}


export default AuthContext