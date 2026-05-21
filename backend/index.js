const express=require('express')
const app=express()
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const multer=require('multer')
const path=require("path")
const cookieParser=require('cookie-parser')
const authRoute=require('./routes/auth')
const userRoute=require('./routes/users')
const postRoute=require('./routes/posts')
const commentRoute=require('./routes/comments')
const verifyToken=require('./verifyToken')

//database
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("database is connected successfully!")

    }
    catch(err){
        console.log(err)
    }
}

//middlewares
dotenv.config()
const allowedOrigin=process.env.CLIENT_URL || "http://localhost:5173"
app.use(express.json())
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:allowedOrigin,credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/comments",commentRoute)

//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,path.join(__dirname,"images"))
    },
    filename:(req,file,fn)=>{
        const safeName=path.basename(req.body.img || `${Date.now()}-${file.originalname}`).replace(/\s+/g,"-")
        fn(null,safeName)
    }
})

const upload=multer({storage:storage})
app.post("/api/upload",verifyToken,upload.single("file"),(req,res)=>{
    res.status(200).json("Image has been uploaded successfully!")
})

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log("app is running on port "+process.env.PORT)
})
