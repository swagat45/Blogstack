const express=require('express')
const router=express.Router()
const Post=require('../models/Post')
const Comment=require('../models/Comment')
const verifyToken = require('../verifyToken')

//CREATE
router.post("/create",verifyToken,async (req,res)=>{
    try{
        const title=req.body.title?.trim()
        const desc=req.body.desc?.trim()

        if(!title || !desc){
            return res.status(400).json("Title and description are required.")
        }

        const newPost=new Post({
            ...req.body,
            title,
            desc,
            categories:Array.isArray(req.body.categories) ? req.body.categories.filter(Boolean) : [],
            userId:req.userId,
            username:req.user.username
        })
        const savedPost=await newPost.save()
        
        res.status(201).json(savedPost)
    }
    catch(err){
        if(err.code===11000){
            return res.status(409).json("A post with the same title already exists.")
        }
        res.status(500).json("Unable to create post.")
    }
     
})

//UPDATE
router.put("/:id",verifyToken,async (req,res)=>{
    try{
        const existingPost=await Post.findById(req.params.id)
        if(!existingPost){
            return res.status(404).json("Post not found!")
        }
        if(existingPost.userId!==req.userId){
            return res.status(403).json("You can update only your own posts.")
        }

        const title=req.body.title?.trim()
        const desc=req.body.desc?.trim()
        if(!title || !desc){
            return res.status(400).json("Title and description are required.")
        }

        const updatedPost=await Post.findByIdAndUpdate(
            req.params.id,
            {$set:{
                ...req.body,
                title,
                desc,
                categories:Array.isArray(req.body.categories) ? req.body.categories.filter(Boolean) : [],
                userId:req.userId,
                username:req.user.username
            }},
            {new:true}
        )
        res.status(200).json(updatedPost)

    }
    catch(err){
        if(err.code===11000){
            return res.status(409).json("A post with the same title already exists.")
        }
        res.status(500).json("Unable to update post.")
    }
})


//DELETE
router.delete("/:id",verifyToken,async (req,res)=>{
    try{
        const existingPost=await Post.findById(req.params.id)
        if(!existingPost){
            return res.status(404).json("Post not found!")
        }
        if(existingPost.userId!==req.userId){
            return res.status(403).json("You can delete only your own posts.")
        }

        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("Post has been deleted!")

    }
    catch(err){
        res.status(500).json("Unable to delete post.")
    }
})


//GET POST DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json("Post not found!")
        }
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json("Unable to fetch post.")
    }
})

//GET POSTS
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const posts=await Post.find(query.search?searchFilter:{}).sort({updatedAt:-1})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json("Unable to fetch posts.")
    }
})

//GET USER POSTS
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId}).sort({updatedAt:-1})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json("Unable to fetch user posts.")
    }
})



module.exports=router
