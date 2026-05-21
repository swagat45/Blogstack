const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    desc:{
        type:String,
        required:true,
        trim:true
    },
    photo:{
        type:String,
        required:false,
        
    },
    username:{
        type:String,
        required:true,
        trim:true  
    },
    userId:{
        type:String,
        required:true,  
    },
    categories:{
        type:Array,
        default:[]
    },
},{timestamps:true})

module.exports=mongoose.model("Post",PostSchema)
