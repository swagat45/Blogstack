/* eslint-disable react/prop-types */
import { formatPostDate, getImageUrl, trimPreview } from '../utils/formatters'

const ProfilePosts = ({p}) => {
  return (
    <div className="w-full flex mt-8 space-x-4">
    {/* left */}
    <div className="w-[35%] h-[200px] flex justify-center items-center">
    <img src={getImageUrl(p.photo)} alt={p.title} className="h-full w-full object-cover"/>
    </div>
    {/* right */}
    <div className="flex flex-col w-[65%]">
      <h1 className="text-xl font-bold md:mb-2 mb-1 md:text-2xl">
      {p.title}
      </h1>
      <div className="flex mb-2 text-sm font-semibold text-gray-500 items-center justify-between md:mb-4">
       <p>@{p.username}</p>
       <div className="flex space-x-2">
       <p>{formatPostDate(p.updatedAt)}</p>
       </div>
      </div>
      <p className="text-sm md:text-lg">{trimPreview(p.desc)}</p>
    </div>

    </div>
  )
}

export default ProfilePosts
