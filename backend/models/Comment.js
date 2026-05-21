const mongoose=require('mongoose')

const CommentSchema=new mongoose.Schema({
    comment:{
        type:String,
        required:true,
        trim:true
    },
    author:{
        type:String,
        required:true,
        trim:true
    },
    postId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports=mongoose.model("Comment",CommentSchema)
