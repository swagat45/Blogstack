import { useLocation } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/UserContext"
import api from "../api"
import PostList from "../components/PostList"


const MyBlogs = () => {
    const {search}=useLocation()
  // console.log(search)
  const [posts,setPosts]=useState([])
  const [noResults,setNoResults]=useState(false)
  const [loader,setLoader]=useState(false)
  const {user}=useContext(UserContext)

  useEffect(()=>{
    if(!user?._id){
      return
    }

    const fetchPosts=async()=>{
      setLoader(true)
      try{
        const res=await api.get("/api/posts/user/"+user._id)
        setPosts(res.data)
        setNoResults(res.data.length===0)
      }
      catch(err){
        console.log(err)
        setPosts([])
        setNoResults(true)
      }
      finally{
        setLoader(false)
      }
    }

    fetchPosts()
  },[search,user?._id])

  return (
    <div>
        <Navbar/>
        <div className="px-8 md:px-[200px] min-h-[80vh]">
        <PostList posts={posts} loader={loader} noResults={noResults} user={user}/>
        </div>
        <Footer/>
    </div>
  )
}

export default MyBlogs
