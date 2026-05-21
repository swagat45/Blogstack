/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import HomePosts from "./HomePosts"
import Loader from "./Loader"

const PostList = ({posts,loader,noResults,user}) => {
  if(loader){
    return <div className="h-[40vh] flex justify-center items-center"><Loader/></div>
  }

  if(noResults){
    return <h3 className="text-center font-bold mt-16">No posts available</h3>
  }

  return posts.map((post)=>(
    <Link key={post._id} to={user?`/posts/post/${post._id}`:"/login"}>
      <HomePosts post={post}/>
    </Link>
  ))
}

export default PostList
