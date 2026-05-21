const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const getCookieOptions=()=>({
    httpOnly:true,
    sameSite:process.env.NODE_ENV==="production" ? "none" : "lax",
    secure:process.env.NODE_ENV==="production"
})


//REGISTER
router.post("/register",async(req,res)=>{
    try{
        const {username,email,password}=req.body
        if(!username || !email || !password){
            return res.status(400).json("Username, email, and password are required.")
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const newUser=new User({username,email,password:hashedPassword})
        const savedUser=await newUser.save()
        const {password:hashed,...info}=savedUser._doc
        res.status(201).json(info)

    }
    catch(err){
        if(err.code===11000){
            return res.status(409).json("Username or email already exists.")
        }
        res.status(500).json("Unable to register user.")
    }

})


//LOGIN
router.post("/login",async (req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            return res.status(400).json("Email and password are required.")
        }

        const user=await User.findOne({email})
       
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(password,user.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        const token=jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        const {password:hashedPassword,...info}=user._doc
        res.cookie("token",token,getCookieOptions()).status(200).json(info)

    }
    catch(err){
        res.status(500).json("Unable to log in.")
    }
})



//LOGOUT
router.get("/logout",async (req,res)=>{
    try{
        res.clearCookie("token",getCookieOptions()).status(200).send("User logged out successfully!")

    }
    catch(err){
        res.status(500).json("Unable to log out.")
    }
})

//REFETCH USER
router.get("/refetch", (req,res)=>{
    const token=req.cookies.token
    if(!token){
        return res.status(401).json("You are not authenticated!")
    }
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(403).json("Token is not valid!")
        }
        res.status(200).json(data)
    })
})



module.exports=router
