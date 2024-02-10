export interface Note {
  id: string
  author: string
  timeStamp: Timestamp
  title: string
  content: string
  songURL: string
  likedBy: string[]
  comments: Comment[]
  [key: string]: any
}

interface Timestamp {
  seconds: number
  nanoseconds: number
}

export interface Comment {
  author: string
  comment: string
  postedAt: Date
}
