const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')


//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
        if(req.userId!==req.params.id){
            return res.status(403).json("You can update only your own account.")
        }

        if(req.body.password){
            const salt=await bcrypt.genSalt(10)
            req.body.password=await bcrypt.hash(req.body.password,salt)
        }
        const updatedUser=await User.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        const {password,...info}=updatedUser._doc
        res.status(200).json(info)

    }
    catch(err){
        res.status(500).json("Unable to update user.")
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        if(req.userId!==req.params.id){
            return res.status(403).json("You can delete only your own account.")
        }

        await User.findByIdAndDelete(req.params.id)
        await Post.deleteMany({userId:req.params.id})
        await Comment.deleteMany({userId:req.params.id})
        res.status(200).json("User has been deleted!")

    }
    catch(err){
        res.status(500).json("Unable to delete user.")
    }
})


//GET USER
router.get("/:id",async (req,res)=>{
    try{
        const user=await User.findById(req.params.id)
        if(!user){
            return res.status(404).json("User not found!")
        }
        const {password,...info}=user._doc
        res.status(200).json(info)
    }
    catch(err){
        res.status(500).json("Unable to fetch user.")
    }
})


module.exports=router
