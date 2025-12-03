"use client"

import type React from "react"
import { useState } from "react"
import { MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CommentCard } from "./comment-card"
import type { Comment } from "@/lib/types"
import { useSpotifySearch } from "@/hooks/use-spotify-search"
import { SpotifySearchResults } from "./spotify-search-results"
import { usePosts } from "@/lib/posts-context"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { getCommentsByPostId, addComment } = usePosts()
  const { user } = useAuth()
  const { toast } = useToast()
  const comments = getCommentsByPostId(postId)

  const [newComment, setNewComment] = useState("")
  const [selectedSong, setSelectedSong] = useState<any>(null)
  const [songSearch, setSongSearch] = useState("")
  const [showSongPicker, setShowSongPicker] = useState(false)

  const { songs, loading } = useSpotifySearch(songSearch, showSongPicker)

  const canSubmit = selectedSong && user

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to be signed in to comment",
        variant: "destructive",
      })
      return
    }

    if (!selectedSong) {
      toast({
        title: "Missing information",
        description: "Please select a song to recommend",
        variant: "destructive",
      })
      return
    }

    try {
      const comment: Comment = {
        id: crypto.randomUUID(),
        postId,
        userId: user.id,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar || "/placeholder.svg",
          email: user.email || "",
          createdAt: new Date(),
        },
        song: selectedSong,
        content: newComment.trim() || "Check out this song!",
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
        userVote: null,
      }

      await addComment(comment)

      // Reset form
      setNewComment("")
      setSelectedSong(null)
      setSongSearch("")
      setShowSongPicker(false)

      toast({
        title: "Comment added",
        description: "Your song recommendation has been posted!",
      })
    } catch (error) {
      console.error("[v0] Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div id="comments" className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{comments.length} Song Recommendations</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2 p-3 bg-muted/20 rounded-lg border border-border/50">
        <div className="space-y-1.5">
          <Label htmlFor="comment" className="text-sm">
            Recommend a similar song (optional)
          </Label>
          <Textarea
            id="comment"
            placeholder="Tell us about a song with similar vibes..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="text-sm"
          />
        </div>

        <SpotifySearchResults
          searchQuery={songSearch}
          onSearchChange={setSongSearch}
          selectedSong={selectedSong}
          onSongSelect={(song) => {
            setSelectedSong(song)
            setShowSongPicker(false)
          }}
          songs={songs}
          loading={loading}
          showPicker={showSongPicker}
          onTogglePicker={() => setShowSongPicker(!showSongPicker)}
        />

        {!user && <p className="text-xs text-amber-600">Please sign in to post a recommendation</p>}

        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={!canSubmit}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-2" />
            Post Recommendation
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recommendations yet. Be the first to suggest a similar song!</p>
          </div>
        )}
      </div>
    </div>
  )
}
