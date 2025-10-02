"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { PostCard } from "./post-card"
import { currentUser } from "@/lib/mock-data"
import { usePosts } from "@/lib/posts-context"
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
  const [displayPosts, setDisplayPosts] = useState<Post[]>([])

  useEffect(() => {
    setDisplayPosts(getAllPosts())
  }, [posts, getAllPosts])

  const addNewPost: AddNewPostFunction = (title: string, content: string, song: Song, theme?: MusicTheme) => {
    const newPost: Post = {
      id: Date.now().toString(), // Simple ID generation
      userId: currentUser.id,
      user: currentUser,
      song,
      title,
      content,
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: new Date(),
      userVote: null,
      theme, // Added theme to new posts
    }

    addPost(newPost)

    if (onNewPost) {
      onNewPost(newPost)
    }
  }

  useImperativeHandle(ref, () => ({
    addNewPost,
  }))

  const handleCommentClick = (postId: string) => {
    // In a real app, this would navigate to the post detail page
    console.log("Navigate to post:", postId)
  }

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <PostCard key={post.id} post={post} onCommentClick={() => handleCommentClick(post.id)} />
      ))}

      {/* Load more placeholder */}
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">
          That's all for now! Check back later for more music discoveries.
        </p>
      </div>
    </div>
  )
})

Feed.displayName = "Feed"
