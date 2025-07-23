import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await api.get('/auth/me'); // create this endpoint if missing
                    setUser(res.data);
                } catch (err) {
                    console.error('Failed to fetch user', err);
                    setToken('');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        fetchUser();
    }, [token]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
