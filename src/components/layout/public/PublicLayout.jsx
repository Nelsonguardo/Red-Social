import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Header from '../public/Header'
import useAuth from '../../../hooks/useAuth'


const PublicLayout = () => {

    const { auth } = useAuth();

    return (
        <>
            <Header />
            <section className="layout__content">
                {!auth._id ?
                    <Outlet />
                    :
                    <Navigate to={"/social"} />
                }
            </section>
        </>
    )
}

export default PublicLayout
