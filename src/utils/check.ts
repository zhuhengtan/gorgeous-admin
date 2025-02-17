export const isImage = (url: string) => {
  const imageReg = /\.(jpg|jpeg|png|gif|webp|bmp)$/i
  return imageReg.test(url)
}

export const isVideo = (url: string) => {
  const videoReg = /\.(mp4|webm|ogg|avi|wmv|flv|mkv|mov)$/i
  return videoReg.test(url)
}