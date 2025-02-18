import { Global } from "./Global";

export const getProfile = async (userId, setState) => {
    const request = await fetch(Global.url + "user/profile/" + userId, {
        method: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": localStorage.getItem("token")
        }
    });
    const data = await request.json();
    if (data.status === "success") {
        setState(data.user);
    }
    return data;
}