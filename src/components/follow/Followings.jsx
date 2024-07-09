import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { useParams } from 'react-router-dom';
import UserList from '../user/UserList';
import { getProfile } from '../../helpers/getProfile';

const Followings = () => {

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState([0]);
    const [userProfile, setUserProfile] = useState({});
    const params = useParams();
    const userId = params.userId;

    useEffect(() => {
        getUsers(1);
        getProfile(params.userId, setUserProfile);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoading(true);
        const request = await fetch(Global.url + "follow/following/" + userId + "/" + nextPage, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("token")
            }
        });
        
        const data = await request.json();
        let clearUsers = []
        data.follows.forEach(follow => {
            clearUsers =[...clearUsers, follow.followed];
        });
        data.users = clearUsers;
        //console.log(data.users);

        if (data.status === "success" && data.users) {
            let newUsers = data.users;
            if (users.length >= 1) {
                newUsers = [...users, ...data.users];
            }
            //console.log(data);
            setUsers(newUsers);
            setFollowing(data.user_following);
            setLoading(false);
            if (users.length >= (data.total - data.users.length)) {
                setMore(false);
            }
        }
    }
    return (
        <>
            <header className="content__header">
                <h1 className="content__title">Usuario que sigue {userProfile.name} {userProfile.lastname}</h1>
            </header>
            <UserList users={users} getUsers={getUsers} following={following} setFollowing={setFollowing} page={page} setPage={setPage} more={more} loading = {loading} />
        </>
    )
}

export default Followings
