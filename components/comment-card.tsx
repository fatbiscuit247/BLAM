"use client"

import { Clock, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MusicPlayer } from "./music-player"
import { VoteButtons } from "./vote-buttons"
import type { Comment } from "@/lib/types"

interface CommentCardProps {
  comment: Comment
  onReply?: () => void
}

export function CommentCard({ comment, onReply }: CommentCardProps) {
  const timeAgo = new Date(comment.createdAt).toLocaleDateString()

  return (
    <div className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
      {/* Vote buttons */}
      <div className="flex-shrink-0">
        <VoteButtons
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          userVote={comment.userVote}
          orientation="vertical"
        />
      </div>

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
          <MusicPlayer song={comment.song} size="sm" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReply}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Reply className="w-3 h-3 mr-1" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}
