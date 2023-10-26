import User from "../models/userModel.js"
import bcrypt from  "bcrypt"
import jwt from "jsonwebtoken"

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body)//taglrdeki name ile db deki sütunlar aynı olmalı
        res.status(201).json({
            succeded: true,
            user
        })
    }
    catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
} 

const loginUser = async (req,res) =>{
    try {
        const  {username,password} =req.body
        console.log("req.body",req.body)
        const user = await User.findOne({username:username})
        let same =false
        
        if(user){
            same = await bcrypt.compare(password,user.password)
        console.log("same",same)
        }else{//kullanıcı bulumadığında
          return  res.status(401).json({
                succeded: false,
                error:"there is no such user"
            })
        }

        if(same){
            //res.status(200).send("You are logged in")
            res.status(200).json({
                user,
                token: createToken(user._id)
            })
        }else{
            res.status(401).json({
                succeded: false,
                error:"Password are not match"
            })
        }

        
    } catch (error) {
        res.status(500).json({
            succeded: false,
            error
        })
    }
}


const createToken = (userId) =>{
    return jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

}


export {createUser,loginUser}