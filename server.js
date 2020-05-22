const bodyParser = require("body-parser")
const express = require("express")
const bcrypt = require('bcryptjs')
const path = require("path")
const fs = require("fs")
const app = express()

app.use(express.static(path.join(__dirname, "Public")))
app.use(bodyParser.json())

let users = []
let comments = []

function checkUser(req){
    for(i=0; i<users.length; i++)
        if(users[i].username==req.user){
            if(users[i].password==req.pass)
                return true
            return false}
    return false
}

async function logg(req){
    const user = users.find(user => user.username === req.user)
        if (user == null) return false
        try {
            if(await bcrypt.compare(req.pass, user.password))
                return {fname: user.firstName, lname: user.lastName, user: user.username, pass: user.password}
            else return false
        } catch {return false}
}

function save(){
    fs.writeFileSync('users.json', JSON.stringify(users))
    fs.writeFileSync('comments.json', JSON.stringify(comments))
}

function init(param = false){
    fs.readFile("users.json", (err, data) => {
        if(err) {
            console.log("Warning: No users FILE found!")
            fs.appendFile('users.json', "", function (err) {
                if (err) console.log("Error: Something wrong with jsons!")
                console.log('Users file created.')})
            return}
        try {
            let x=JSON.parse(data)
            users=x
            if(param)
                console.log(users)
        }
        catch(err) {
            console.log("Warning: No users found!")}
    })

    fs.readFile("comments.json", (err, data) => {
        if(err) {
            console.log("Warning: No comments FILE found!")
            fs.appendFile('comments.json', "", function (err) {
                if (err) console.log("Error: Something wrong with jsons!")
                console.log('Comments file created.')})
            return}
        try {
            let x=JSON.parse(data)
            comments=x
            if(param)
                console.log(comments)}
        catch(err) {
            console.log("Warning: No comments found!")}
        console.log(comments)
    })
}init(true)

/*-----------------------------------------------------------------------*/

app.get("/", (req, res) => {
    res.sendFile(__dirname+"/Public/html/index.html")
});

app.post("/autologin", (req, res) => {
    if(checkUser(req.body))
        res.status(200).send(JSON.stringify(req.body))
    else res.status(401).send()
})

app.post("/login", async function(req, res){
    let data = req.body
    ok = await logg(data)
    if(ok)
        res.status(200).send(JSON.stringify(ok))
    else(res.status(401)).send()
    console.log(JSON.stringify(ok));
})

app.get("/comments", (req, res) => {
    res.status(200).send(JSON.stringify(comments))
})

app.get("/comments2", (req, res) => {
    let comm = comments
    comm.sort(function(x, y){
        return x.text.localeCompare(y.text)
    })
    res.status(200).send(JSON.stringify(comm))
})

app.get("/comments3", (req, res) => {
    let comm = []
    for(i=0; i<comments.length; i++){
        comm = comm.concat(comments[i])
        if(comm[comm.length-1].text==""){
            comm.pop()
            console.log("qqq")
        }
    }
    res.status(200).send(JSON.stringify(comm))
})

app.post("/comments", async function(req, res){
    console.log(req.body)
    if(checkUser(req.body)){
        comments.push({user: req.body.user,text: req.body.text, time:new Date().toLocaleString()})
        res.status(201).send("Comment added.")}
    else res.status(401).send("You cannot comment!")
})

app.post("/register", async (req, res) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            mail: req.body.mail,
            password: hash,
            confirm: req.body.confirm,
            option: req.body.option,
            checkbox: req.body.checkbox,
            gender: req.body.gender,
            points: req.body.points
        }
        users.push(user)
        res.status(201).send(JSON.stringify({username:user.username, password:user.password}))
    } catch {
        res.status(500).send()
        console.log("Statuscode 500")}
})

app.delete("/delete", async (req, res) => {
    for(i=0; i<users.length; i++)
        if(users[i].username==req.body.username){
            if(await bcrypt.compare(req.body.password, users[i].password)){
                res.status(200).send("Account deleted.")
                users.splice(i, 1);
                return
            }
            res.status(401).send("Delete password incorrect!")
            return
        }
    res.status(401).send("Delete username incorrect!")
})

app.put("/update", async (req, res) => {
    console.log(req.body)
    for(i=0; i<users.length; i++)
        if(users[i].username==req.body.username){
            if(await bcrypt.compare(req.body.password, users[i].password)){
                res.status(200).send({res: "Account  updated"})
                users[i].mail = req.body.mail
                users[i].option = req.body.option
                users[i].checkbox = req.body.checkbox
                users[i].points = req.body.points
                return
            }
            res.status(401).send({res: "Delete password incorrect!"})
            return
        }
    res.status(401).send({res: "Delete username incorrect!"})
})

app.get("*", (req, res) => {
    console.log("404 on adress "+req.url)
    res.status(404).sendFile(__dirname+"/Public/html/404.html")
});

app.listen(3000)