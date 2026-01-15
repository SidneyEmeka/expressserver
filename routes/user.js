import express from 'express';
const userRoutes = express.Router(); //instatiating routes
import bcrypt from 'bcrypt';
import 'dotenv/config'
import jwt from 'jsonwebtoken';
import { allRefreshTokens, authenticateToken, generateAccessToken, generateRefreshsToken } from '../controllers/productcontroller.js';


const users = [];

userRoutes.post("/sign-up", async(req,res)=>{

    try{
        //hashing
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        // console.log(salt);
        // console.log(hashedPassword);
        const aUser = {"username": req.body.username,"age":req.body.age, "password": hashedPassword};
users.push(aUser);
     res.status(201).send({"message":"Account created", "data":aUser})
    } catch{
        res.status(500).send()
    }


});


userRoutes.post("/login", async(req,res)=>{
    var foundUser = users.find(user => user.username == req.body.username);
    if(foundUser==null){
        res.status(404).send({"message":"User not found", "data":`No user with name ${req.body.username} found`});
    }
    try{
        if(await bcrypt.compare(req.body.password, foundUser.password)){
           const accessToken = generateAccessToken(foundUser) //ASIGN Token to the found user
                      const refreshToken = generateRefreshsToken(foundUser) //ASIGN Token to the found user

            res.status(200).send({"message":"Login Successful", "data" : {"user":foundUser, "tokens": {"accessToken": accessToken, "refreshToken":refreshToken}}})
        }

        else{
    res.status(400).send({"message":"Login Unsuccessful", "data" : "Password incorrect"});
        }

    }catch(e){
        res.status(500).send(e)
    }
})


userRoutes.get("/all-users",authenticateToken, (req,res)=>{
     res.status(200).send({"message":"All Users", "data":users})
});



userRoutes.post('/ref-token', (req,res)=>{
    const refToken = req.body.refreshToken;
    if(refToken == null) {return res.status.send("No token")};
  if(!allRefreshTokens.includes(refToken)) {return res.status.send("Refresh Token does'nt exist")}
  jwt.verify(refToken, process.env.REFRESH_WEB_TOKEN_SECRET, (err,user)=>{
    if(err) return res.status(400).send("Didnt refresh");
    const accessToken = generateAccessToken(user);
     res.status(200).send({"message":"Token refreshed", "accessToken":accessToken})
  })


})


export default userRoutes;