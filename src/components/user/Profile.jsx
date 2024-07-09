import React, { useEffect, useState } from 'react';
import avatar from '../../assets/img/user.png';
import { getProfile } from '../../helpers/getProfile';
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import PublicationList from '../publication/PublicationList';

const Profile = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState({});
    const [counter, setCounter] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publication, setPublication] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const params = useParams();

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1, true);
        setMore(true);
    }, [params.userId]);

    const getDataUser = async () => {
        let dataUser = await getProfile(params.userId, setUser);
        if (dataUser.following && dataUser.following._id) setIFollow(true);
    };

    const getCounters = async () => {
        const request = await fetch(Global.url + "user/counters/" + params.userId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        //console.log(data);
        if (data) {
            setCounter(data);
        }
    };

    const follow = async (userId) => {
        const request = await fetch(Global.url + "follow/save", {
            method: "POST",
            body: JSON.stringify({ followed: userId }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            setIFollow(true);
        }
    };

    const unfollow = async (userId) => {
        const request = await fetch(Global.url + "follow/unfollow/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });

        const data = await request.json();

        if (data.status === "success") {
            setIFollow(false);
        }
    };

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(Global.url + "publication/user/" + params.userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        const data = await request.json();
        if (data.status === "success" && Array.isArray(data.publications)) {

            let newPublication = data.publications;

            if (!newProfile && publication.length >= 1) {
                newPublication = [...publication, ...data.publications];
            }

            if (newProfile) {
                newPublication = data.publications;
                setMore(true);
                setPage(1);
            }

            setPublication(newPublication);

            if (!newProfile && publication.length >= (data.total - data.publications.length)) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    };

    return (
        <>
            <header className="aside__profile-info">
                <div className="profile-info__general-info">
                    <div className="general-info__container-avatar">
                        {user.image !== "default.jpg" ? (
                            <img src={`${Global.url}user/avatar/${user.image}`} className="post__user-image" alt="Foto de perfil" />
                        ) : (
                            <img src={avatar} className="post__user-image" alt="Foto de perfil" />
                        )}
                    </div>
                    <div className="general-info__container-names">
                        <h1 className="container-names__name">
                            {user.name} {user.lastname}
                            {user._id !== auth._id &&
                                (iFollow ?
                                    <button className="content__button content__button--right post__button" onClick={() => unfollow(user._id)}>Dejar de seguir</button>
                                    :
                                    <button className="content__button content__button--right" onClick={() => follow(user._id)}>Seguir</button>
                                )}
                        </h1>
                        <h2 className="container-names__nickname">@{user.nick}</h2>
                        <p>{user.bio}</p>
                    </div>
                </div>
                <div className="profile-info__stats">
                    <div className="stats__following">
                        <Link to={"/social/siguiendo/" + user._id} className="following__link">
                            <span className="following__title">Siguiendo</span>
                            <span className="following__number">{counter.following > 0 ? counter.following : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/seguidores/" + user._id} className="following__link">
                            <span className="following__title">Seguidores</span>
                            <span className="following__number">{counter.followed > 0 ? counter.followed : 0}</span>
                        </Link>
                    </div>
                    <div className="stats__following">
                        <Link to={"/social/perfil/" + user._id} className="following__link">
                            <span className="following__title">Publicaciones</span>
                            <span className="following__number">{counter.publications > 0 ? counter.publications : 0}</span>
                        </Link>
                    </div>
                </div>
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
    );
};

export default Profile;
