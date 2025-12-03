"use client"

import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SpotifyPlayer } from "./spotify-player"
import type { Comment } from "@/lib/types"

interface CommentCardProps {
  comment: Comment
}

export function CommentCard({ comment }: CommentCardProps) {
  const timeAgo = new Date(comment.createdAt).toLocaleDateString()

  return (
    <div className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      {/* Content */}
      <div className="flex-1 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.username} />
            <AvatarFallback className="text-xs">{comment.user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">u/{comment.user.username}</span>
          <span className="text-muted-foreground text-xs">•</span>
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Comment text */}
        <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>

        {/* Recommended song */}
        <div className="bg-background/50 rounded-lg p-3 border border-border/30">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Recommended similar track:</p>
          <SpotifyPlayer song={comment.song} />
        </div>
      </div>
    </div>
  )
}
