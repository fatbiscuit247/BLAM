"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Post, Community } from "./types"
import { createBrowserClient } from "./supabase/client"

interface PostsContextType {
  posts: Post[]
  addPost: (post: Post) => Promise<void>
  deletePost: (id: string) => Promise<void>
  getPost: (id: string) => Post | undefined
  getAllPosts: () => Post[]
  getPostsByTheme: (theme: string) => Post[]
  customCommunities: Community[]
  addCommunity: (community: Community) => Promise<void>
  getCommunity: (id: string) => Community | undefined
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [customCommunities, setCustomCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load posts
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select(`
            *,
            users:user_id (username, avatar)
          `)
          .order("created_at", { ascending: false })

        if (postsError) throw postsError

        if (postsData) {
          const formattedPosts: Post[] = postsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            content: p.content,
            author: p.users.username,
            authorId: p.user_id,
            authorAvatar: p.users.avatar,
            timestamp: new Date(p.created_at),
            upvotes: p.upvotes,
            downvotes: p.downvotes,
            comments: 0, // We'll calculate this separately if needed
            song: {
              title: p.song_title,
              artist: p.song_artist,
              album: p.song_album,
              albumArt: p.album_art,
              previewUrl: p.preview_url,
              spotifyUrl: p.spotify_url,
            },
            theme: p.theme,
          }))
          setPosts(formattedPosts)
        }

        // Load custom communities
        const { data: communitiesData, error: communitiesError } = await supabase
          .from("communities")
          .select("*")
          .eq("is_default", false)

        if (communitiesError) throw communitiesError

        if (communitiesData) {
          const formattedCommunities: Community[] = communitiesData.map((c: any) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            icon: c.icon,
            color: c.color,
            memberCount: c.member_count,
          }))
          setCustomCommunities(formattedCommunities)
        }
      } catch (error) {
        console.error("[v0] Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    const postsSubscription = supabase
      .channel("posts_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
    }
  }, [])

  const addPost = async (post: Post) => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .insert({
          title: post.title,
          content: post.content,
          user_id: post.userId,
          song_title: post.song.title,
          song_artist: post.song.artist,
          song_album: post.song.album,
          album_art: post.song.imageUrl,
          preview_url: post.song.previewUrl,
          spotify_url: post.song.spotifyUrl,
          theme: post.theme,
          upvotes: 0,
          downvotes: 0,
        })
        .select(`
        *,
        users:user_id (username, avatar)
      `)
        .single()

      if (error) throw error

      if (data) {
        const formattedPost: Post = {
          id: data.id,
          title: data.title,
          content: data.content,
          userId: data.user_id,
          user: {
            id: data.user_id,
            username: data.users.username,
            avatar: data.users.avatar,
            email: "",
            createdAt: new Date(),
          },
          song: {
            id: data.id,
            title: data.song_title,
            artist: data.song_artist,
            album: data.song_album,
            imageUrl: data.album_art,
            previewUrl: data.preview_url,
            spotifyUrl: data.spotify_url,
          },
          theme: data.theme,
          upvotes: data.upvotes,
          downvotes: data.downvotes,
          commentCount: 0,
          createdAt: new Date(data.created_at),
          userVote: null,
        }

        setPosts((prev) => [formattedPost, ...prev.filter((p) => p.id !== post.id)])
      }
    } catch (error) {
      console.error("[v0] Error adding post:", error)
      setPosts((prev) => prev.filter((p) => p.id !== post.id))
      throw error
    }
  }

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", id)

      if (error) throw error

      setPosts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("[v0] Error deleting post:", error)
      throw error
    }
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

  const addCommunity = async (community: Community) => {
    try {
      const { error } = await supabase.from("communities").insert({
        id: community.id,
        name: community.name,
        description: community.description,
        icon: community.icon,
        color: community.color,
        member_count: community.memberCount,
        is_default: false,
      })

      if (error) throw error

      setCustomCommunities((prev) => [...prev, community])
    } catch (error) {
      console.error("[v0] Error adding community:", error)
      throw error
    }
  }

  const getCommunity = (id: string) => {
    return customCommunities.find((c) => c.id === id)
  }

  if (isLoading) {
    return null // Or a loading spinner
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
