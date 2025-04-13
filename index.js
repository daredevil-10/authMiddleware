const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

let users = [];

const JWT_SECRET = "kuch_bhi";

app.use(express.json());

app.post("/signup" , (req,res)=>
{
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username : username , 
        password : password
    })

    res.send({
        message:"You have signed up"
    })

    console.log(users);
});


app.post("/signin" , (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    let user = users.find((u)=> u.username == username && u.password == password);

    if(user)
    {
        let token = jwt.sign({
            username
        } , JWT_SECRET);

        res.send({
            token
        })
        console.log(users);
    }

    else
    {
        res.Status(403).send({
            message:"Invalid username and password"
        })
    }
});

function auth (req,res ,next)
{
    const token = req.headers.token;
    const decodeInformation = jwt.verify(token,JWT_SECRET);
    const username = decodeInformation.username;
    if(username)
    {
        req.username = username
        next();
    }
    else{
        res.send({
            message:"You are not logged in"
        })
    }
}

app.get("/me" ,auth, (req,res)=>{
   

    let foundUser = null;

    for(let i = 0 ; i<users.length;i++)
    {
        if(users[i].username == req.username)
        {
            foundUser = users[i];
        }
    }
    if(foundUser)
    {
        res.send({
            username: foundUser.username,
            password: foundUser.password
        })
    }
    else{
        res.send({
            message:"Unauthorised"
        })
    }
})


app.listen(3000);