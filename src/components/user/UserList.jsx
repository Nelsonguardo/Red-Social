import React from 'react'
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import avatar from '../../assets/img/user.png';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';


const UserList = ({ users, getUsers, following, setFollowing, page, setPage, more, loading }) => {

    const { auth } = useAuth();

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
        //console.log(following);
    }

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
            setFollowing([...following, userId])
        }
    }

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
            let filterFollowings = following.filter(followingUserId => userId != followingUserId);
            setFollowing(filterFollowings);
        }
    }
    return (
        <>
            <div className="content__posts">
                {users.map(user => {
                    const createDate = new Date(user.create_at).getTime()
                    return (
                        <article className="posts__post" key={user._id}>
                            <div className="post__container">
                                <div className="post__image-user">
                                    <Link to={"/social/perfil/" + user._id} className="post__image-link">
                                        {user.image != "default.jpg" && <img src={Global.url + "user/avatar/" + user.image} className="post__user-image" alt="Foto de perfil" />}
                                        {user.image == "default.jpg" && <img src={avatar} className="post__user-image" alt="Foto de perfil" />}
                                    </Link>
                                </div>
                                <div className="post__body">
                                    <div className="post__user-info">
                                        <Link to={"/social/perfil/" + user._id} className="user-info__name">{user.name} {user.lastname}</Link>
                                        <span className="user-info__divider"> | </span>
                                        <Link to={"/social/perfil/" + user._id} className="user-info__create-date"><ReactTimeAgo date={createDate} locale="es"></ReactTimeAgo></Link>
                                    </div>
                                    <h4 className="post__content">{user.bio}</h4>
                                </div>
                            </div>
                            {user._id != auth._id &&
                                <div className="post__buttons">
                                    {!following.includes(user._id) &&
                                        <button className="post__button post__button--green" onClick={() => follow(user._id)}>
                                            Seguir
                                        </button>
                                    }
                                    {following.includes(user._id) &&
                                        <button className="post__button" onClick={() => unfollow(user._id)}>
                                            Dejar de seguir
                                        </button>
                                    }
                                </div>
                            }
                        </article>
                    );
                })}
            </div>
            {loading ? <div> Cargando... </div> : ""}
            {more &&
                <div className="content__container-btn">
                    <button className="content__btn-more-post" onClick={nextPage}>
                        Ver mas personas
                    </button>
                </div>
            }
        </>
    )
}

export default UserList
