import React, { useEffect, useState } from "react";
import style from '../assets/css/HomePage.module.css'
import style2 from '../assets/css/LoginPage.module.css'
import { useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";

function Home(){
    const colors = [style.box__iconcolor1,style.box__iconcolor2,
        style.box__iconcolor3,style.box__iconcolor4,
        style.box__iconcolor5,style.box__iconcolor6,
        style.box__iconcolor7,style.box__iconcolor8,
        style.box__iconcolor9
    ] 
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [notification, setNotification] = useState({"status":false, "title":"", "mess":"", "type":true})
    const [rog, setRog] = useState(Array(9).fill(false))
    let indexColor = -1
    const {name, notes, reLoad} = useOutletContext()
    const [input, setInput] = useState({"status":false, "title":"", "contents":"", "tag":""})
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    
    return(
        <>
            <div className={style.noteMain}>
                {
                    notes?.map((item, index)=>{
                        if(indexColor==colors.length-1){indexColor=-1}
                        indexColor+=1
                        return(
                            <div key={index} className={[style.noteMain__box, rog[index]?style.noteMainBox__rote180:""].join(" ")}
                                onClick={()=>{
                                    if(rog[index]){
                                        let a = [...rog]
                                        a[index]=false
                                        setRog(a)
                                    }else{
                                        let a = [...rog]
                                        a[index]=true
                                        setRog(a)
                                    }
                                }}
                            >
                                <div className={style.box__title}>
                                    <p>{item.title}</p>
                                </div>
                                <span>
                                    <span></span>
                                </span>
                                <div className={style.box__content}>
                                    {
                                        item.contents?.map((itemContent, indexContent)=>{
                                            return (<p key={indexContent}>{itemContent}</p>)
                                        })
                                    }
                                </div>
                                <div className={style.box__tag}>
                                    <p>{item.tag}</p>
                                </div>
                                <div className={
                                    [style.box__icon, colors[indexColor]].join(" ")
                                    }>
                                    <span></span>
                                </div>
                                <div className={[style.box__delete, rog[index]?style.box__deleteActive:""].join(" ")}>
                                    <p
                                        onClick={()=>{
                                            setLoading(true)
                                            DeleteNote(name, item.title, navigate, API_URL).then((data)=>{
                                                if(!data[0]){
                                                    setNotification({"status":false,"title":"Thông báo", "mess":data[1], "type":false})
                                                }else{
                                                    reLoad()
                                                    setNotification({"status":true,"title":"Thông báo", "mess":data[1], "type":true})
                                                }
                                                setLoading(false)
                                            })
                                        }}
                                    >Xóa note</p>
                                </div>
                            </div>)
                    })
                }
                {name!=""?
                    <div className={style.noteMain__box}>
                        <div className={style.addNote}>
                            <p
                                onClick={()=>{
                                    setInput({"status":true, "title":input.title, "contents":input.contents, "tag":input.tag})
                                }}
                            >Thêm note</p>
                        </div>
                    </div>
                :""
                }
            </div>
            <div className={[style.inputNote, input.status?style.inputNoteAcctive:""].join(" ")}>
                <div className={style.inputNote__box}>
                    <div className={style.box__input}>
                        <input 
                            value={input.title}
                            onChange={(e)=>{setInput({"status":true, "title":e.target.value, "contents":input.contents, "tag":input.tag})}}
                        type="text" placeholder="Tiêu đề"/>
                        <textarea
                            value={input.contents}
                            onChange={(e)=>{setInput({"status":true, "title":input.title, "contents":e.target.value, "tag":input.tag})}}
                        name="" id="" placeholder="Nội dung"/>
                        <input
                            value={input.tag}
                            onChange={(e)=>{setInput({"status":true, "title":input.title, "contents":input.contents, "tag":e.target.value})}}
                        type="text" placeholder="Tag"/>
                    </div>
                    <div className={style.box__button}>
                        <p
                            onClick={()=>{
                                setLoading(true)
                                AddNote(input.title, input.contents, input.tag, name, navigate, API_URL).then((data)=>{
                                    if(!data[0]){
                                        setNotification({"status":true,"title":"Thông báo", "mess":data[1], "type":false})
                                    }else{
                                        setInput({"status":true, "title":"", "contents":"", "tag":""})
                                        setNotification({"status":true,"title":"Thông báo", "mess":"Đã thêm", "type":true})
                                    }
                                    reLoad()
                                    setLoading(false)
                                })
                            }}
                        >Thêm note</p>
                        <p
                            onClick={()=>{
                                setInput({"status":false, "title":input.title, "contents":input.contents, "tag":input.tag})
                            }}
                        >Hủy</p>
                    </div>
                </div>
            </div>
            <div className={[style2.loading, loading ? style2.loadingacctive : ""].join(" ")}>
                <img src="loading.gif" alt="" />
            </div>
            <div className={[style2.notification, notification.status ? style2.notificationAcctive : ""].join(" ")}>
                    <div className={style2.notificationBox}>
                        <div className={style2.boxIcon}>
                            {notification.type?
                                <img src="success.png" alt="" />:
                                <img src="err.png" alt="" />
                            }
                        </div>
                        <div className={style2.boxText}>
                            <div className={style2.title}>
                                <p>{notification.title}</p>
                            </div>
                            <div className={style2.content}>
                                <p>{notification.mess}</p>
                            </div>
                        </div>
                        <div className={style2.boxClose}>
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





async function AddNote(title, contents, tag, nameMenu, navigate, API_URL){
    if(title==""||contents==""||tag==""){
        return [false, "Không được để trống thông tin."]
    }
    try{
        const data = await axios.post(API_URL+"/api/v1/note-app/note/note",
            {
                nameMenu:nameMenu,
                title:title,
                contents:contents.split("\n"),
                tag:tag
            },
            {withCredentials: true})
        return [true, data]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Không thể kết nối tới server!"]
        }
        else{
            if(err.response.data.status==401){
                navigate("/login")
            }
            if(err.response.data.status==400){
                return [false, err.response.data.errMessage.mess]
            }
        }
        return [false, "Lỗi không xác định!"]
    }


}


async function DeleteNote(name, title, navigate, API_URL){
    try{
        const data = await axios.delete(API_URL+"/api/v1/note-app/note/note?nameMenu="+name+"&titleNote="+title,
            {withCredentials: true})
        return [true, "Đã xóa note."]
    }catch(err){
        if(err.code=="ERR_NETWORK"){
            return [false, "Không thể kết nối tới server!"]
        }
        else{
            if(err.response.data.status==401){
                navigate("/login")
            }
            if(err.response.data.status==400){
                return [false, err.response.data.errMessage.mess]
            }
        }
        return [false, "Lỗi không xác định!"]
    }


}

export default Home;