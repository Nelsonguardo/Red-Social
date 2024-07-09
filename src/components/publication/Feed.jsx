import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import PublicationList from './PublicationList'

const Feed = () => {

    const { auth } = useAuth();
    const [publication, setPublication] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const params = useParams();

    useEffect(() => {
        
        getPublications(1, false);
        
    }, []);

    const getPublications = async (nextPage = 1, showNew = false) => {
        if (showNew) {
            setPublication([]);
            setPage(1);
            nextPage = 1;
        }
        const request = await fetch(Global.url + "publication/feed/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success" && Array.isArray(data.publications)) {

            let newPublication = data.publications;

            if (!showNew && publication.length >= 1) {
                newPublication = [...publication, ...data.publications];
            }

            setPublication(newPublication);

            if (!showNew && publication.length >= (data.total - data.publications.length)) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    };

    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Timeline</h1>
                <button className="content__button" onClick={() => getPublications(1, true)}>Mostrar nuevas</button>
            </header>
            <PublicationList
                publication={publication}
                getPublications={getPublications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
            />
        </>
    )
}

export default Feed
