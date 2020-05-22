async function login(){
    if(!localStorage.getItem("username") || !localStorage.getItem("password"))
        return false

    const obj = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password")
    }
    const res = await fetch("/autologin", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(obj)
    })

    if(res.status==200){
        console.log("status 200")
        return true
    }
    alert(res.status)
    return false
}

async function refresh(){
    console.log("refresh")
    x = await fetch("/comments")
    let y = await x.json()
    console.log(y)
    append(y)
}refresh()

async function append(newMessages){

    const main = document.getElementById("container")
    main.innerHTML = ""
    newMessages.forEach(element => {
        var temp = `<div class="div">
                <div>
                    <p class="date">(${element.time.toLocaleString()})</p>
                    <p class="username">${element.user}:</p>
                </div>
                <p class="comment">${element.text}</p>
            </div>`
            main.insertAdjacentHTML('afterbegin',temp)
    })
}

document.getElementById("btn").addEventListener("click", async function(e){
    e.preventDefault()
    const req = {
        user: localStorage.getItem("username"),
        pass: localStorage.getItem("password"),
        text: document.getElementById("text").value
    }
    document.getElementById("text").value=""
    const res = await fetch("/comments",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(req)
    })
    if(res.status==201){
        clearInterval(timer)
        refresh()
        setTimeout(() => {
            autorefreh()
        }, refreshrate);
    }
    else
        alert("You can't comment")
})

var timer
var refreshrate = 3000

function autorefreh(){
    clearInterval(timer)    //  IMPORTANT
    timer = setInterval(() => {
        console.log("autorefresh")
        refresh()
    }, refreshrate);
}autorefreh()