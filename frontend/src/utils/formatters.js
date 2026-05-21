import { IF } from "../url"

export const formatPostDate=(value)=>{
  if(!value){
    return ""
  }

  return new Date(value).toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

export const getImageUrl=(photo)=>(
  photo ? `${IF}${photo}` : "https://placehold.co/800x500?text=Blog+Image"
)

export const trimPreview=(text,limit=200)=>{
  if(!text){
    return ""
  }

  return text.length>limit ? `${text.slice(0,limit)} ...Read more` : text
}
