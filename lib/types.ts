export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface Song {
  id: string
  title: string
  artist: string
  album?: string
  duration?: number
  spotifyUrl?: string
  youtubeUrl?: string
  previewUrl?: string
  imageUrl?: string
  genre?: string
}

export type MusicTheme = "happy" | "sad" | "energetic" | "chill" | "romantic" | "angry" | "nostalgic" | "party"

export interface Community {
  id: string
  name: string
  description: string
  icon: string
  color: string
  memberCount: number
  isCustom?: boolean // Flag to identify user-created communities
  createdBy?: string // User ID who created the community
}

export interface Post {
  id: string
  userId: string
  user: User
  song: Song
  title: string
  content?: string
  upvotes: number
  downvotes: number
  commentCount: number
  createdAt: Date
  userVote?: "up" | "down" | null
  theme?: string
}

export interface Comment {
  id: string
  postId: string
  userId: string
  user: User
  song: Song
  content: string
  upvotes: number
  downvotes: number
  createdAt: Date
  userVote?: "up" | "down" | null
}
