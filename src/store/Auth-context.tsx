
import React, { useState, createContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useNotification } from "./Notification-context";

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
    const { showNotification } = useNotification();

    const navigate = useNavigate();

    const checkLocalStorageToken = () => {
        const token = localStorage.getItem('authToken');
        return !!token; // Returns true if the token exists
    };

    // This effect runs when the component mounts and checks for the token in local storage
    useEffect(() => {
        const userIsLoggedIn = checkLocalStorageToken();
        setIsLoggedIn(userIsLoggedIn);
    }, []);


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
                showNotification('success', 'Logout successful!', 5000);
                navigate('/')
            } else {
                showNotification('error', 'Logout failed. Please try again.', 5000);
            }
        } catch (error) {
            // console.log('Error during logout:', error);
            showNotification('error', `Error during logout:${error}`, 5000);
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
                showNotification('success', 'Login Successful!', 5000);
                navigate('/doglist');

            } else {
                showNotification('error', 'Login failed. Please try again.', 5000);
            }
        } catch (error) {
            showNotification('error', `An error occurred during login:${error}`, 5000);

        }
    }
    return <AuthContext.Provider value={{ isLoggedIn: isLoggedIn, onLogout: logoutHandler, onLogin: loginHandler }}>{props.children}</AuthContext.Provider>
}


export default AuthContext