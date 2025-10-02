"use client"

import { create } from "zustand"
import type { Post, MusicTheme } from "./types"
import { mockPosts } from "./mock-data"

interface PostsStore {
  posts: Post[]
  addPost: (post: Post) => void
  getPost: (id: string) => Post | undefined
  getAllPosts: () => Post[]
  getPostsByTheme: (theme: MusicTheme) => Post[] // Added theme filtering
}

export const usePostsStore = create<PostsStore>((set, get) => ({
  posts: mockPosts,
  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),
  getPost: (id) => get().posts.find((p) => p.id === id),
  getAllPosts: () => get().posts,
  getPostsByTheme: (theme) => get().posts.filter((p) => p.theme === theme), // Filter posts by theme
}))
