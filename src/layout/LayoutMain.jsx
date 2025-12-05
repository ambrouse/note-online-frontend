import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import '../assets/css/LayoutMain.css'
import axios from "axios";
import style from '../assets/css/LoginPage.module.css'

function LayoutMain(){
    const [tog, setTog] = useState(true)
    const navigate = useNavigate();
    const [nameMenus, setNameMenus] = useState([])
    const [input, setInput] = useState({"status":false,"value":""})
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({"status":false, "title":"", "mess":"", "type":true})
    const [nameCurrent, setNameCurrent] = useState("")
    const [notes, setNotes] = useState([])


    const onLayoutUpdate = useCallback(()=>{
        setLoading(true)
        GetNote(nameCurrent,navigate).then((dataNote)=>{
            if(dataNote[0]==false){
                setNotification({"status":true, "title":"Thông báo", "mess":dataNote[1], "type":false})
            }else{
                setNotes(dataNote[1])
            }
            setLoading(false)
        })
    })
    useEffect(()=>{
        setLoading(true)
        LoadMenu(navigate).then((data)=>{
            if(data[0]){
                setNameMenus(data[1])
                if(data[1].length>0){
                    GetNote(data[1][0].name,navigate).then((dataNote)=>{
                        if(dataNote[0]==false){
                            setNotification({"status":true, "title":"Thông báo", "mess":dataNote[1], "type":false})
                        }else{
                            setNameCurrent(data[1][0].name)
                            setNotes(dataNote[1])
                        }
                    })
                }
                setLoading(false)
            }else{
                setNotification({"status":true, "title":"Thông báo", "mess":data[1], "type":false})
            }
        })
    },[])
    

    return(
        <>
            <div className="note">
                <div className="note__menu">
                    <div className="note__menu--button" onClick={()=>{
                        SetAnimationButtonMenu(tog)
                        if(tog){setTog(false)}else{setTog(true)}
                    }}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="note__menu--main">
                        {nameMenus.map((item, index)=>{
                                return (
                                    <div key={index} className="main__item">
                                        <p
                                            onClick={()=>{
                                                setLoading(true)
                                                    GetNote(item.name,navigate).then((data)=>{
                                                        if(data[0]==false){
                                                            setNotification({"status":true, "title":"Thông báo", "mess":data[1], "type":false})
                                                        }else{
                                                            setNameCurrent(item.name)
                                                            setNotes(data[1])
                                                        }
                                                        setLoading(false)
                                                    })
                                                
                                            }}
                                        >{item.name}</p>
                                        <p
                                            onClick={()=>{
                                                setLoading(true)
                                                DeleteMenu(item.name).then((data)=>{
                                                    if(!data[0]){
                                                        setNotification({"status":true, "title":"Thông báo", "mess":data[1], "type":false})
                                                    }else{
                                                        setNameMenus(data[1])
                                                        if(data[1].length>0){
                                                            GetNote(data[1][0].name,navigate).then((dataNote)=>{
                                                                if(dataNote[0]==false){
                                                                    setNotification({"status":true, "title":"Thông báo", "mess":dataNote[1], "type":false})
                                                                }else{
                                                                    if(nameCurrent==item.name){
                                                                        setNameCurrent(data[1][0].name)
                                                                        setNotes(dataNote[1])
                                                                    }
                                                                }
                                                                setLoading(false)
                                                            })
                                                        }else{
                                                            setNameCurrent("")
                                                            setNotes([])
                                                        }
                                                        setNotification({"status":true, "title":"Thông báo", "mess":"Đã xóa menu.", "type":true})
                                                    }
                                                    setLoading(false)
                                                })
                                            }}  
                                        >Xóa</p>
                                    </div>
                                )})}
                        <div className="main__item">
                            <p
                                onClick={()=>{
                                    setInput({"status":true,"value":input.value})
                                }}
                            >
                                Thêm menu</p>
                            <p></p>
                        </div>                  
                    </div>
                </div>
                <Outlet context={{name:nameCurrent, notes:notes, reLoad:onLayoutUpdate}}/>
            </div>
            <div className={input.status? "inputMenu inputMenu__acctive":"inputMenu"}>
                <div className="inputMenu__box">
                    <div className="box__form">
                        <input 
                            value={input.value}
                            onChange={(e)=>{
                                setInput({"status":true,"value":e.target.value})
                            }}
                        type="text" />
                    </div>
                    <div className="box__button">
                        <p
                            onClick={()=>{
                                if(input.value.length){
                                    setLoading(true)
                                    AddMenu(input.value).then((data)=>{
                                        if(!data[0]){
                                            setNotification({"status":true, "title":"Thông báo", "mess":data[1], "type":false})
                                        }else{
                                            setNotification({"status":true, "title":"Thông báo", "mess":"Đã thêm menu.", "type":true})
                                            setNameMenus(data[1])
                                            setInput({"status":true,"value":""})
                                        }
                                        setLoading(false)
                                    })
                                }else{
                                    setLoading(false)
                                    setNotification({"status":true, "title":"Thông báo", "mess":"Không được để trống tên.", "type":false})
                                }
                            }}
                        >Thêm menu</p>
                        <p
                            onClick={()=>{
                                setInput({"status":false,"value":input.value})
                            }}
                        >Hủy</p>
                    </div>
                </div>
            </div>
            <div className={[style.loading, loading ? style.loadingacctive : ""].join(" ")}>
                <img src="loading.gif" alt="" />
            </div>
            <div className={[style.notification, notification.status ? style.notificationAcctive : ""].join(" ")}
                onClick={()=>{
                    setNotification({"status":false, "mess":"", "type":true})
                }}
            >
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
        </>
    )
}





async function LoadMenu(navigate){
    try{
        const data = await axios.get("https://note-online-backend.vercel.app/api/v1/note-app/menu/menu",{
            withCredentials: true})    
        return [true,data.data.result.nameMenus]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Server sập."]
        }
        else{
            if(err.response.data.status==401){
                navigate("/")
            }
        }
    }
} 


async function AddMenu(name){
    try{
        const data = await axios.post("https://note-online-backend.vercel.app/api/v1/note-app/menu/menu",
            {"name":name},
            {withCredentials: true})  

        return [true,data.data.result.nameMenus]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Không thể kết nối tới server!"]
        }
        else if(err.response.data.status==400){
            return [false, err.response.data.errMessage.mess]
        }
        else{
            if(err.response.data.status==401){
                navigate("/")
            }
        }
        return [false, "Lỗi không xác định!"]
    }

}


async function DeleteMenu(name){
    try{
        const data = await axios.delete("https://note-online-backend.vercel.app/api/v1/note-app/menu/menu/"+name,
            {withCredentials: true})  

        return [true,data.data.result.nameMenus]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Không thể kết nối tới server!"]
        }
        else if(err.response.data.status==400){
            return [false, err.response.data.errMessage.mess]
        }
        else{
            if(err.response.data.status==401){
                navigate("/")
            }
        }
        return [false, "Lỗi không xác định!"]
    }

}


function SetAnimationButtonMenu(tog){
    if(tog){
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.add("acctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.remove("unacctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.add("acctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.remove("unacctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.add("acctive__span3")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.remove("unacctive__span3")

        document.querySelector(".note .note__menu .note__menu--main").classList.add("menu__animation")
        document.querySelector(".note .note__menu .note__menu--main").classList.remove("unmenu__animation")
        
    }else{
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.add("unacctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.remove("acctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.add("unacctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.remove("acctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.add("unacctive__span3")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.remove("acctive__span3")
        document.querySelector(".note .note__menu .note__menu--main").classList.add("unmenu__animation")
        document.querySelector(".note .note__menu .note__menu--main").classList.remove("menu__animation")
        
    }
}


async function GetNote(name,navigate){

    try{
        const data = await axios.get("https://note-online-backend.vercel.app/api/v1/note-app/note/note/"+name,
            {withCredentials: true})
        
        return [true,data.data.result.data]

    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Không thể kết nối tới Server!"]
        }
        else{
            if(err.response.data.status==401){
                navigate("/")
            }
        }
        return [false, "Lỗi không xác định!"]
    }


}

export default LayoutMain;