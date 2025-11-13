"use client"

import { MessageCircle, Share2, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MusicPlayer } from "./music-player"
import { VoteButtons } from "./vote-buttons"
import type { Post } from "@/lib/types"
import Link from "next/link"
import { getCommunity } from "@/lib/communities"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PostCardProps {
  post: Post
  onCommentClick?: () => void
}

export function PostCard({ post, onCommentClick }: PostCardProps) {
  const timeAgo = new Date(post.createdAt).toLocaleDateString()
  const { getCommunity: getCustomCommunity, deletePost } = usePosts()
  const { user } = useAuth()
  const defaultCommunity = post.theme ? getCommunity(post.theme) : null
  const customCommunity = post.theme ? getCustomCommunity(post.theme) : null
  const community = defaultCommunity || customCommunity

  const isAuthor = user?.id === post.user.id

  const handleDelete = () => {
    deletePost(post.id)
  }

  return (
    <Card className="p-4 space-y-4 bg-card border-border hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/profile/${post.user.username}`}>
          <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
            <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${post.user.username}`}>
              <span className="font-medium text-sm hover:underline cursor-pointer">u/{post.user.username}</span>
            </Link>
            {community && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <Link href={`/community/${community.id}`}>
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                    <span>{community.icon}</span>
                    <span>{community.name}</span>
                  </span>
                </Link>
              </>
            )}
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
        </div>
        {isAuthor && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete post?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground leading-tight">{post.title}</h2>

      {/* Content */}
      {post.content && <p className="text-muted-foreground text-sm leading-relaxed">{post.content}</p>}

      {/* Music Player */}
      <MusicPlayer song={post.song} size="md" />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <VoteButtons
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            userVote={post.userVote}
            orientation="horizontal"
          />

          <Link href={`/post/${post.id}`}>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
              <MessageCircle className="w-4 h-4" />
              <span className="ml-1 text-xs">{post.commentCount}</span>
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  )
}
