"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Post, Community } from "./types"
import { mockPosts } from "./mock-data"

interface PostsContextType {
  posts: Post[]
  addPost: (post: Post) => void
  deletePost: (id: string) => void
  getPost: (id: string) => Post | undefined
  getAllPosts: () => Post[]
  getPostsByTheme: (theme: string) => Post[]
  customCommunities: Community[]
  addCommunity: (community: Community) => void
  getCommunity: (id: string) => Community | undefined
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

const POSTS_STORAGE_KEY = "blam_posts"
const COMMUNITIES_STORAGE_KEY = "blam_communities"
const OLD_POSTS_STORAGE_KEY = "soundshare_posts"
const OLD_COMMUNITIES_STORAGE_KEY = "soundshare_communities"

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => {
    if (typeof window === "undefined") return mockPosts

    try {
      let stored = localStorage.getItem(POSTS_STORAGE_KEY)
      if (!stored) {
        stored = localStorage.getItem(OLD_POSTS_STORAGE_KEY)
        if (stored) {
          localStorage.setItem(POSTS_STORAGE_KEY, stored)
          localStorage.removeItem(OLD_POSTS_STORAGE_KEY)
          console.log("[v0] Migrated posts from old storage key")
        }
      }

      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.length > 0 ? parsed : mockPosts
      }
    } catch (error) {
      console.error("[v0] Error loading posts from localStorage:", error)
    }
    return mockPosts
  })

  const [customCommunities, setCustomCommunities] = useState<Community[]>(() => {
    if (typeof window === "undefined") return []

    try {
      let stored = localStorage.getItem(COMMUNITIES_STORAGE_KEY)
      if (!stored) {
        stored = localStorage.getItem(OLD_COMMUNITIES_STORAGE_KEY)
        if (stored) {
          localStorage.setItem(COMMUNITIES_STORAGE_KEY, stored)
          localStorage.removeItem(OLD_COMMUNITIES_STORAGE_KEY)
          console.log("[v0] Migrated communities from old storage key")
        }
      }

      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("[v0] Error loading communities from localStorage:", error)
    }
    return []
  })

  useEffect(() => {
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts))
    } catch (error) {
      console.error("[v0] Error saving posts to localStorage:", error)
    }
  }, [posts])

  useEffect(() => {
    try {
      localStorage.setItem(COMMUNITIES_STORAGE_KEY, JSON.stringify(customCommunities))
    } catch (error) {
      console.error("[v0] Error saving communities to localStorage:", error)
    }
  }, [customCommunities])

  const addPost = (post: Post) => {
    setPosts((prev) => [post, ...prev])
  }

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  const getPost = (id: string) => {
    return posts.find((p) => p.id === id)
  }

  const getAllPosts = () => {
    return posts
  }

  const getPostsByTheme = (theme: string) => {
    return posts.filter((p) => p.theme === theme)
  }

  const addCommunity = (community: Community) => {
    setCustomCommunities((prev) => [...prev, community])
  }

  const getCommunity = (id: string) => {
    return customCommunities.find((c) => c.id === id)
  }

  return (
    <PostsContext.Provider
      value={{
        posts,
        addPost,
        deletePost,
        getPost,
        getAllPosts,
        getPostsByTheme,
        customCommunities,
        addCommunity,
        getCommunity,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
