require("dotenv").config()
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const Hashes = require("jshashes")
const md5 = new Hashes.MD5

const connectDB = require("./config")

const User = require('./user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
app.use(express.static(__dirname + "/views"))
connectDB();

app.get("/", (req, res) => res.sendFile("index.html"))

app.post("/user", (req, res) => {
    const username = req.body.username;
    const pin = req.body.pin
    const interests = req.body.interests
    const newUser = {username, pin, interests}
    console.log(newUser)
    User.create(newUser, (err, newUser) => {
        if (err) {
            console.log(err)
            res.json({"err": err})
        } else {
            res.status(201).json(newUser)
        }
    })  
})

app.post("/user/login", (req, res) => {
    const username = req.body.username;
    const pin = req.body.pin
    console.log(req.body)
    User.find({username})
    .then(user => {
        console.log(user)
        if (user.length == 0) {
            res.json({"message": "Invalid username"})
        } else {
            const userPin = user[0].pin
            if (pin == userPin) {
                res.json({
                    "message": "Success", 
                    "user": user[0]
                })
            } else{
                res.json({"message": "Invalid pin"})
            }
        }
    })
    .catch(err => {
        res.json({"message": err})
    })
})

app.get("/user/:username", (req, res) => {
    const username = req.params.username;
    User.find({username})
    .then(user => res.json(user[0].interests))
    .catch(err => res.json({"err": err}))
})

app.put("/user/:username/:type", (req, res) => {
    const username = req.params.username;
    const type = req.params.type
    const newInterest = req.body.interests;
    console.log(username, type, newInterest)
    User.find({username})
    .then(user => {
        let interests = user[0].interests;
        if (type == "add") {
            if (!interests.includes(newInterest)) {
                interests.push(newInterest)
            }
        } 
        if (type == "delete") {
            interestTemp = interests.filter(i => i != newInterest)
            interests = interestTemp
            console.log(interests)
        }
        User.findOneAndUpdate({username}, {interests}, {new: true})
        .then(changedUser => {
            res.json(changedUser.interests)
        })
        .catch(changedErr => {
            console.log(changedErr)
            res.json({"changederr": changedErr})
        })
    })
    .catch(err => res.json({"err": err}))
})

app.delete("/user/:username", (req, res) => {
    const username = req.params.username
    User.deleteOne({username})
    .then(() => res.json({message: "Deleted"}))
    .catch((err) => res.send(err));
})



app.listen(3000, '0.0.0.0', () => console.log("App is running"));