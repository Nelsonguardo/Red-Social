import React, { useState } from 'react'
import useForm from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';
import avatar from '../../assets/img/user.png'; //avatar

export default function Config() {

    const {auth, setAuth} = useAuth();
    const [saved, setSaved] = useState("not_sended");

    const updateUser = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        let newDataUser = SerializeForm(e.target);3
        delete newDataUser.file0

        const request = await fetch(Global.url + "user/update", {
            method: "PUT",
            body: JSON.stringify(newDataUser),
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        });
        const data = await request.json();

        if (data.status === "success" && data.user) {
            delete data.user.password;
            setAuth(data.user);
            setSaved("saved");
        } else {
            setSaved("error");
        }

        //subida de imagen
        const fileInput = document.querySelector("#file");

        if(data.status === "success" && fileInput.files[0]) {

            const formData = new FormData();
            formData.append('file0',fileInput.files[0]);

            const uploadRequest = await fetch(Global.url + "user/upload", {
                method: "POST",
                body: formData,
                headers:{
                    "Authorization": token
                }
            });
            const uploadData = await uploadRequest.json();

            if(uploadData.status === "success" && uploadData.user) {
                delete uploadData.user.password;
                setSaved("saved");
                setAuth(uploadData.user);
            }else{
                setSaved("error");
            }
        }
    }
    return (
        <>
            <header className="content__header content__header--public">
                <h1 className="content__title">Ajustes</h1>
            </header>
            <div className='content__posts'>
                {
                    saved === "saved" ?
                        <strong className="alert alert-success">Usuario actualizado correctamente</strong> : ""}
                {
                    saved === "error" ?
                        <strong className="alert alert-danger">Error al actualizar usuario</strong> : ""
                }
                <form className="config__form" onSubmit={updateUser}>
                    <div className="form__group">
                        <label htmlFor="name">Nombre</label>
                        <input type="text" name="name" defaultValue={auth.name}/>
                    </div>
                    <div className="form__group">
                        <label htmlFor="lastname">Apellidos</label>
                        <input type="text" name="lastname" defaultValue={auth.lastname}/>
                    </div>
                    <div className="form__group">
                        <label htmlFor="nick">Nick</label>
                        <input type="text" name="nick" defaultValue={auth.nick}/>
                    </div>
                    <div className="form__group">
                        <label htmlFor="bio">Biografia</label>
                        <textarea name="bio" defaultValue={auth.bio}/>
                    </div>
                    <div className="form__group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" name="email" defaultValue={auth.email}/>
                    </div>
                    <div className="form__group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" />
                    </div>
                    <div className="form__group">
                        <label htmlFor="file0">Avatar</label>
                        <div className='general-info__container-avatar'>
                        {auth.image != "default.jpg" && <img src={Global.url + "user/avatar/" + auth.image} className="list-end__img" alt="Foto de perfil" />}
                        {auth.image == "default.jpg" && <img src={avatar} className="list-end__img" alt="Foto de perfil" />}
                        </div>
                        <br/>
                        <input type="file" name="file0" id="file" />
                    </div>
                    <br/>
                    <input type="submit" value="Actualizar" className="btn btn-success" />
                </form>
            </div>
        </>
    )
}
