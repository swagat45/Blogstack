const express=require('express')
const router=express.Router()
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const comment=req.body.comment?.trim()
        const postId=req.body.postId?.trim()

        if(!comment || !postId){
            return res.status(400).json("Comment and postId are required.")
        }

        const newComment=new Comment({
            ...req.body,
            comment,
            postId,
            author:req.user.username,
            userId:req.userId
        })
        const savedComment=await newComment.save()
        res.status(201).json(savedComment)
    }
    catch(err){
        res.status(500).json("Unable to create comment.")
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
        const existingComment=await Comment.findById(req.params.id)
        if(!existingComment){
            return res.status(404).json("Comment not found!")
        }
        if(existingComment.userId!==req.userId){
            return res.status(403).json("You can update only your own comments.")
        }

        const comment=req.body.comment?.trim()
        if(!comment){
            return res.status(400).json("Comment is required.")
        }

        const updatedComment=await Comment.findByIdAndUpdate(
            req.params.id,
            {$set:{comment}},
            {new:true}
        )
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json("Unable to update comment.")
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        const existingComment=await Comment.findById(req.params.id)
        if(!existingComment){
            return res.status(404).json("Comment not found!")
        }
        if(existingComment.userId!==req.userId){
            return res.status(403).json("You can delete only your own comments.")
        }

        await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json("Comment has been deleted!")

    }
    catch(err){
        res.status(500).json("Unable to delete comment.")
    }
})




//GET POST COMMENTS
router.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId}).sort({createdAt:1})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json("Unable to fetch comments.")
    }
})


module.exports=router
