import React from 'react';
import { Route, Routes, BrowserRouter, Navigate, Link } from 'react-router-dom';
import PublicLayout from '../components/layout/public/PublicLayout';
import Login from '../components/user/Login';
import Register from '../components/user/Register';
import PrivateLayout from '../components/layout/private/PrivateLayout';
import Feed from '../components/publication/Feed';
import { AuthProvider } from '../context/AuthProvider';  // Asegúrate de importar AuthProvider correctamente
import Logout from '../components/user/Logout';
import People from '../components/user/People';
import Config from '../components/user/Config';
import Followings from '../components/follow/Followings';
import Followers from '../components/follow/Followers';
import Profile from '../components/user/Profile';

const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='registro' element={<Register />} />
                    </Route>

                    <Route path='/social' element={<PrivateLayout />} >
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='logout' element={<Logout />} />
                        <Route path='gente' element={<People />} />
                        <Route path='ajustes' element={<Config />} />
                        <Route path='siguiendo/:userId' element={<Followings />} />
                        <Route path='seguidores/:userId' element={<Followers />} />
                        <Route path='perfil/:userId' element={<Profile />} />
                    </Route>

                    <Route path='*' element={
                        <>
                            <p>
                                <h1>ERROR 404</h1>
                                <Link to='/'>Volver al inicio</Link>
                            </p>
                        </>
                    } />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default Routing;
