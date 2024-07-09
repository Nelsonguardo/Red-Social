import React, { createContext, useEffect, useState } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            setLoading(false);
            return false;
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id;

        const request = await fetch(Global.url + "user/profile/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const data = await request.json();
        setAuth(data.user);

        const requestCuonter = await fetch(Global.url + "user/counters/" + userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        const dataCounter = await requestCuonter.json();
        setCounters(dataCounter);
        setLoading(false);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, counters, setCounters, loading  }}>
            {children}
        </AuthContext.Provider>
    );
}

// Exporta AuthContext por separado
export { AuthContext };
