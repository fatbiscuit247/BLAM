import type { User, Song, Post, Comment } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    username: "musiclover42",
    email: "music@example.com",
    avatar: "/music-lover-avatar.png",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    username: "vinylcollector",
    email: "vinyl@example.com",
    avatar: "/placeholder-xzofk.png",
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "3",
    username: "indievibes",
    email: "indie@example.com",
    avatar: "/placeholder-ke2f0.png",
    createdAt: new Date("2024-03-10"),
  },
]

export const mockSongs: Song[] = [
  {
    id: "1",
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    duration: 244,
    imageUrl: "/synthwave-album-cover.png",
    genre: "Synthwave",
  },
  {
    id: "2",
    title: "Time to Dance",
    artist: "The Sounds",
    album: "Living in America",
    duration: 198,
    imageUrl: "/rock-album-cover.png",
    genre: "Rock",
  },
  {
    id: "3",
    title: "Resonance",
    artist: "HOME",
    album: "Odyssey",
    duration: 213,
    imageUrl: "/placeholder-aiyr8.png",
    genre: "Synthwave",
  },
  {
    id: "4",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    duration: 200,
    imageUrl: "/placeholder-uq4ne.png",
    genre: "Synthpop",
  },
]

export const mockPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    user: mockUsers[0],
    song: mockSongs[0],
    title: "This track gives me major nostalgic vibes",
    content:
      "Found this gem while driving at night. The synth work is incredible and it perfectly captures that dreamy, nostalgic feeling.",
    upvotes: 42,
    downvotes: 3,
    commentCount: 8,
    createdAt: new Date("2024-03-15T14:30:00"),
    userVote: null,
    theme: "nostalgic", // Added theme to mock posts
  },
  {
    id: "2",
    userId: "2",
    user: mockUsers[1],
    song: mockSongs[1],
    title: "Perfect workout energy!",
    content: "This song gets me so pumped up. The guitar riffs are insane!",
    upvotes: 28,
    downvotes: 1,
    commentCount: 12,
    createdAt: new Date("2024-03-14T09:15:00"),
    userVote: null,
    theme: "energetic", // Added theme to mock posts
  },
]

export const mockComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    userId: "2",
    user: mockUsers[1],
    song: mockSongs[2],
    content: "If you like M83, you'll love this HOME track. Similar synthwave vibes but more chill.",
    upvotes: 15,
    downvotes: 0,
    createdAt: new Date("2024-03-15T15:45:00"),
    userVote: null,
  },
  {
    id: "2",
    postId: "1",
    userId: "3",
    user: mockUsers[2],
    song: mockSongs[3],
    content: "The Weeknd's synthwave-inspired stuff hits the same nostalgic notes!",
    upvotes: 23,
    downvotes: 2,
    createdAt: new Date("2024-03-15T16:20:00"),
    userVote: null,
  },
]

// Current user for demo purposes
export const currentUser: User = mockUsers[0]
