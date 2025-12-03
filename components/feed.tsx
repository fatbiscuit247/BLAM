"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { PostCard } from "./post-card"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import type { Post, Song, MusicTheme } from "@/lib/types"

export type AddNewPostFunction = (title: string, content: string, song: Song, theme?: MusicTheme) => void

interface FeedProps {
  onNewPost?: (post: Post) => void
}

export interface FeedRef {
  addNewPost: AddNewPostFunction
}

export const Feed = forwardRef<FeedRef, FeedProps>(({ onNewPost }, ref) => {
  const { posts, addPost, getAllPosts } = usePosts()
  const { user, isAuthenticated } = useAuth()
  const [displayPosts, setDisplayPosts] = useState<Post[]>([])

  useEffect(() => {
    setDisplayPosts(getAllPosts())
  }, [posts, getAllPosts])

  const addNewPost: AddNewPostFunction = (title: string, content: string, song: Song, theme?: MusicTheme) => {
    if (!isAuthenticated || !user) {
      console.error("[v0] Cannot create post: user not authenticated")
      alert("Please sign in to create posts")
      return
    }

    const newPost: Post = {
      id: crypto.randomUUID(), // Generate UUID in browser for optimistic UI update
      userId: user.id,
      user: user,
      song,
      title,
      content,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date(),
      userVote: null,
      theme,
    }

    addPost(newPost).catch((error) => {
      console.error("[v0] Error creating post:", error)
      alert("Failed to create post. Please try again.")
    })

    if (onNewPost) {
      onNewPost(newPost)
    }
  }

  useImperativeHandle(ref, () => ({
    addNewPost,
  }))

  const handleCommentClick = (postId: string) => {
    console.log("Navigate to post:", postId)
  }

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <PostCard key={post.id} post={post} onCommentClick={() => handleCommentClick(post.id)} />
      ))}

      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          That's all for now! Check back later for more music discoveries.
        </p>
      </div>
    </div>
  )
})

Feed.displayName = "Feed"
