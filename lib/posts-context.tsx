"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Post, Community, Comment } from "./types"
import { createBrowserClient } from "./supabase/client"
import { useAuth } from "./auth-context"

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
  comments: Comment[]
  addComment: (comment: Comment) => Promise<void>
  getCommentsByPostId: (postId: string) => Comment[]
  voteOnPost: (postId: string, voteType: "up" | "down") => Promise<void>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [customCommunities, setCustomCommunities] = useState<Community[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [votingPosts, setVotingPosts] = useState<Set<string>>(new Set())
  const supabase = createBrowserClient()
  const { user } = useAuth()

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

        // Load comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(`
            *,
            users:user_id (username, avatar)
          `)
          .order("created_at", { ascending: false })

        if (commentsError) throw commentsError

        const userVotesMap: Record<string, "up" | "down"> = {}
        if (user) {
          const { data: votesData, error: votesError } = await supabase
            .from("votes")
            .select("post_id, vote_type")
            .eq("user_id", user.id)

          if (!votesError && votesData) {
            votesData.forEach((vote: any) => {
              userVotesMap[vote.post_id] = vote.vote_type
            })
          }
        }

        const commentCountMap: Record<string, number> = {}
        if (commentsData) {
          commentsData.forEach((comment: any) => {
            commentCountMap[comment.post_id] = (commentCountMap[comment.post_id] || 0) + 1
          })
        }

        if (postsData) {
          const formattedPosts: Post[] = postsData
            .filter((p: any) => p.users) // Filter out posts with deleted users
            .map((p: any) => ({
              id: p.id,
              title: p.title,
              content: p.content,
              userId: p.user_id,
              user: {
                id: p.user_id,
                username: p.users?.username || "Deleted User",
                avatar: p.users?.avatar || "/placeholder.svg",
                email: "",
                createdAt: new Date(),
              },
              song: {
                id: p.id,
                title: p.song_title,
                artist: p.song_artist,
                album: p.song_album,
                imageUrl: p.album_art,
                previewUrl: p.preview_url,
                spotifyUrl: p.spotify_url,
              },
              theme: p.theme,
              upvotes: p.upvotes || 0,
              downvotes: p.downvotes || 0,
              commentCount: commentCountMap[p.id] || 0,
              createdAt: new Date(p.created_at),
              userVote: userVotesMap[p.id] || null, // Set user's vote status from database
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
            memberCount: c.member_count || 0,
          }))
          setCustomCommunities(formattedCommunities)
        }

        if (commentsData) {
          const formattedComments: Comment[] = commentsData
            .filter((c: any) => c.users)
            .map((c: any) => ({
              id: c.id,
              postId: c.post_id,
              userId: c.user_id,
              user: {
                id: c.user_id,
                username: c.users?.username || "Deleted User",
                avatar: c.users?.avatar || "/placeholder.svg",
                email: "",
                createdAt: new Date(),
              },
              song: {
                id: c.id,
                title: c.song_title,
                artist: c.song_artist,
                album: c.song_album,
                imageUrl: c.album_art,
                previewUrl: c.preview_url,
                spotifyUrl: c.spotify_url,
              },
              content: c.content,
              upvotes: 0,
              downvotes: 0,
              createdAt: new Date(c.created_at),
              userVote: null,
            }))
          setComments(formattedComments)
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

    const commentsSubscription = supabase
      .channel("comments_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        loadData()
      })
      .subscribe()

    const votesSubscription = supabase
      .channel("votes_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "votes" }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
      commentsSubscription.unsubscribe()
      votesSubscription.unsubscribe()
    }
  }, [user]) // Updated dependency to user

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
            username: data.users?.username || "Unknown",
            avatar: data.users?.avatar || "/placeholder.svg",
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
          upvotes: data.upvotes || 0,
          downvotes: data.downvotes || 0,
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

  const addComment = async (comment: Comment) => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: comment.postId,
          user_id: comment.userId,
          content: comment.content,
          song_title: comment.song.title,
          song_artist: comment.song.artist,
          song_album: comment.song.album,
          album_art: comment.song.imageUrl,
          preview_url: comment.song.previewUrl,
          spotify_url: comment.song.spotifyUrl,
        })
        .select(`
          *,
          users:user_id (username, avatar)
        `)
        .single()

      if (error) throw error

      if (data) {
        const formattedComment: Comment = {
          id: data.id,
          postId: data.post_id,
          userId: data.user_id,
          user: {
            id: data.user_id,
            username: data.users?.username || "Unknown",
            avatar: data.users?.avatar || "/placeholder.svg",
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
          content: data.content,
          upvotes: 0,
          downvotes: 0,
          createdAt: new Date(data.created_at),
          userVote: null,
        }

        setComments((prev) => [formattedComment, ...prev])

        setPosts((prev) => prev.map((p) => (p.id === comment.postId ? { ...p, commentCount: p.commentCount + 1 } : p)))
      }
    } catch (error) {
      console.error("[v0] Error adding comment:", error)
      throw error
    }
  }

  const getCommentsByPostId = (postId: string) => {
    return comments.filter((c) => c.postId === postId)
  }

  const voteOnPost = async (postId: string, voteType: "up" | "down") => {
    if (!user) {
      console.log("[v0] No user logged in, cannot vote")
      return
    }

    if (votingPosts.has(postId)) {
      console.log("[v0] Vote already in progress for post:", postId)
      return
    }

    console.log("[v0] Starting vote:", { postId, voteType, userId: user.id })

    const post = posts.find((p) => p.id === postId)
    if (!post) {
      console.log("[v0] Post not found:", postId)
      return
    }

    setVotingPosts((prev) => {
      const next = new Set(prev)
      next.add(postId)
      console.log("[v0] Added to voting posts, now:", Array.from(next))
      return next
    })

    try {
      // Check if user already has a vote
      const { data: existingVote, error: voteCheckError } = await supabase
        .from("votes")
        .select("*")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle() // Use maybeSingle instead of single to handle no results

      if (voteCheckError) {
        console.error("[v0] Error checking existing vote:", voteCheckError)
        throw voteCheckError
      }

      console.log("[v0] Existing vote:", existingVote)

      let upvoteChange = 0
      let downvoteChange = 0
      let newUserVote: "up" | "down" | null = null

      if (existingVote) {
        // User already voted
        if (existingVote.vote_type === voteType) {
          console.log("[v0] Removing vote (same button clicked)")
          const { error: deleteError } = await supabase
            .from("votes")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId)

          if (deleteError) throw deleteError

          if (voteType === "up") {
            upvoteChange = -1
          } else {
            downvoteChange = -1
          }
          newUserVote = null
        } else {
          console.log("[v0] Changing vote (opposite button clicked)")
          const { error: updateError } = await supabase
            .from("votes")
            .update({ vote_type: voteType })
            .eq("user_id", user.id)
            .eq("post_id", postId)

          if (updateError) throw updateError

          if (voteType === "up") {
            upvoteChange = 1
            downvoteChange = -1
          } else {
            upvoteChange = -1
            downvoteChange = 1
          }
          newUserVote = voteType
        }
      } else {
        console.log("[v0] Adding new vote")
        const { error: insertError } = await supabase.from("votes").insert({
          user_id: user.id,
          post_id: postId,
          vote_type: voteType,
        })

        if (insertError) throw insertError

        if (voteType === "up") {
          upvoteChange = 1
        } else {
          downvoteChange = 1
        }
        newUserVote = voteType
      }

      console.log("[v0] Vote changes:", { upvoteChange, downvoteChange, newUserVote })

      const newUpvotes = Math.max(0, (post.upvotes || 0) + upvoteChange)
      const newDownvotes = Math.max(0, (post.downvotes || 0) + downvoteChange)

      const { error: updatePostError } = await supabase
        .from("posts")
        .update({
          upvotes: newUpvotes,
          downvotes: newDownvotes,
        })
        .eq("id", postId)

      if (updatePostError) throw updatePostError

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                upvotes: newUpvotes,
                downvotes: newDownvotes,
                userVote: newUserVote,
              }
            : p,
        ),
      )

      console.log("[v0] Vote completed successfully")
    } catch (error) {
      console.error("[v0] Error voting on post:", error)
    } finally {
      setVotingPosts((prev) => {
        const next = new Set(prev)
        next.delete(postId)
        console.log("[v0] Removed from voting posts, now:", Array.from(next))
        return next
      })
    }
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
        comments,
        addComment,
        getCommentsByPostId,
        voteOnPost, // Export the voteOnPost function
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
