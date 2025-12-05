import React, { useState } from "react";
import axios from "axios";
import style from '../assets/css/LoginPage.module.css'
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [name, setName] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({"status":false, "title":"", "mess":"", "type":true})
    const navigate = useNavigate()
        
    return(
        <div className={style.login}>
            <div className={style.login__background}>
                <img src="background.gif" alt="" />
            </div>
            <div className={style.login__form}>
                <div className={style.loginTitle}>
                    <h1>Login</h1>
                </div>
                <div className={style.loginInput}>
                    <input type="text" placeholder="" 
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                    />
                    <span>Name</span>
                </div>
                <div className={style.loginInput}>
                    <input type="password" placeholder=""
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                    />
                    <span>Password</span>
                </div>
                <div className={style.loginButton}
                    onClick={()=>{
                        setLoading(true)
                        login(name, password).then((data)=>{
                            setLoading(false)
                            if(!data[0]){
                                setNotification({"status":true, "title": "Không thể đăng nhập.", "mess":data[1], "type":false})
                            }else{
                                navigate("/home")
                            }
                        })
                    }}
                >
                    <span>Login</span>
                </div>
            </div>
            <div className={[style.loading, loading ? style.loadingacctive : ""].join(" ")}>
                    <img src="loading.gif" alt="" />
            </div>
            <div className={[style.notification, notification.status ? style.notificationAcctive : ""].join(" ")}>
                    <div className={style.notificationBox}>
                        <div className={style.boxIcon}>
                            {notification.type?
                                <img src="success.png" alt="" />:
                                <img src="err.png" alt="" />
                            }
                        </div>
                        <div className={style.boxText}>
                            <div className={style.title}>
                                <p>{notification.title}</p>
                            </div>
                            <div className={style.content}>
                                <p>{notification.mess}</p>
                            </div>
                        </div>
                        <div className={style.boxClose}>
                            <img src="close.png" alt="" 
                                onClick={()=>{
                                    setNotification({"status":false, "mess":"", "type":true})
                                }}
                            />
                        </div>
                    </div>
            </div>
        </div>
    )
}



async function login(name, pass){
    try{

        if(name==undefined){
            name = "_"
        }
        if(pass==undefined){
            pass = "_"
        }

        let res = await axios.post("https://note-online-backend.vercel.app/api/v1/note-app/auth/login",
            {
                "name":"03d7a18a6511afb549cc1ac87c997e3ce648012c85c6a2e8dc0d2a7eb19e897c",
                "pass":"b565f8239c8ec957cb46264002cfaf57119c8792a70d2d03df9a9d41727dd959"
                // "name":name,
                // "pass":pass
            },
            {withCredentials: true,
            headers: { "Content-Type": "application/json" },})
        return [true,""]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Server sập."]
        }
        else{
            if(err.response.data.status==400){
                return [false, err.response.data.errMessage]
            }
        }
    }
}


