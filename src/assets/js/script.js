export const test = ()=>{
    console.log("HHHh")
    
    let tog = true
    
    document.addEventListener("DOMContentLoaded", async () => {
    const button = document.querySelector(".note .note__menu .note__menu--button")
    const menuMain = document.querySelector(".note .note__menu .note__menu--main")
    const menuAdd = await LoadTxtMenu(menuMain)
    const inputButtonAdd = document.querySelector(".input .input__box .input__box--button p:nth-child(1)")
    const inputButtonQuit = document.querySelector(".input .input__box .input__box--button p:nth-child(2)")
   
    
    button.addEventListener('click',()=>{
        tog = SetAnimationButtonMenu(tog)
    })
    menuAdd.addEventListener('click',()=>{
        AddMenuTxtAnimation(true)
    })
    inputButtonQuit.addEventListener('click',()=>{
        AddMenuTxtAnimation(false)
    })
    
    inputButtonAdd.addEventListener('click',()=>{
        AddMenuTxt()
    })

    
    
});



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
        return false
    }else{
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.add("unacctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(1)").classList.remove("acctive__span1")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.add("unacctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(3)").classList.remove("acctive__span2")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.add("unacctive__span3")
        document.querySelector(".note .note__menu .note__menu--button span:nth-child(2)").classList.remove("acctive__span3")
        document.querySelector(".note .note__menu .note__menu--main").classList.add("unmenu__animation")
        document.querySelector(".note .note__menu .note__menu--main").classList.remove("menu__animation")
        return true
    }
}


async function LoadTxtMenu (main){
    await fetch('./menu.txt')
    .then(response => response.text())
    .then(text => {
        text.split('|').forEach((item)=>{
            const newDiv = document.createElement("div");
            const newP = document.createElement("p");
            newP.textContent = item;
            newDiv.classList.add("main__item")
            newDiv.appendChild(newP);
            main.appendChild(newDiv);
        });
        const newDiv = document.createElement("div");
        const newP = document.createElement("p");
        newP.textContent = "New folder";
        newDiv.classList.add("main__item")
        newDiv.appendChild(newP);
        main.appendChild(newDiv);
    })
    .catch(err => console.error("Lỗi đọc file:", err));
    
    return document.querySelectorAll(".note .note__menu .note__menu--main .main__item")[document.querySelectorAll(".note .note__menu .note__menu--main .main__item").length - 1]
}

function AddMenuTxt(){
    const fs = require('fs');
    try {
        fs.appendFileSync('menu.txt', 'Dòng mới (ghi đồng bộ)\n');
        console.log('Đã thêm nội dung xong!');
    } catch (err) {
        console.error('Lỗi khi ghi:', err);
    }
}

function AddMenuTxtAnimation(tog){
    const input = document.querySelector(".input")
    const inputBoxText = document.querySelector(".input .input__box .input__box--text")
    const inputBoxButton = document.querySelector(".input .input__box .input__box--button")
    if(tog){
        input.classList.add("input__active")
        input.classList.remove("uninput__active")
        inputBoxText.classList.add("input__menu")
        inputBoxText.classList.remove("uninput__menu")
        inputBoxButton.classList.add("input__menu")
        inputBoxButton.classList.remove("uninput__menu")
    }else{
        input.classList.add("uninput__active")
        input.classList.remove("input__active")
        input.classList.remove("oninput")
        inputBoxText.classList.add("uninput__menu")
        inputBoxText.classList.remove("input__menu")
        inputBoxButton.classList.add("uninput__menu")
        inputBoxButton.classList.remove("input__menu")
    }
}
}