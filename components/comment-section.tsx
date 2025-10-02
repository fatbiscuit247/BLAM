"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, Music, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CommentCard } from "./comment-card"
import { MusicPlayer } from "./music-player"
import { mockComments, mockSongs } from "@/lib/mock-data"
import type { Comment, Song } from "@/lib/types"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [comments] = useState<Comment[]>(mockComments.filter((c) => c.postId === postId))
  const [newComment, setNewComment] = useState("")
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const [songSearch, setSongSearch] = useState("")
  const [showSongPicker, setShowSongPicker] = useState(false)

  const filteredSongs = mockSongs.filter(
    (song) =>
      song.title.toLowerCase().includes(songSearch.toLowerCase()) ||
      song.artist.toLowerCase().includes(songSearch.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !selectedSong) return

    // In a real app, this would create the comment
    console.log("Creating comment:", { content: newComment, song: selectedSong })

    // Reset form
    setNewComment("")
    setSelectedSong(null)
    setSongSearch("")
    setShowSongPicker(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <MessageCircle className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{comments.length} Song Recommendations</span>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/20 rounded-lg border border-border/50">
        <div className="space-y-2">
          <Label htmlFor="comment">Recommend a similar song</Label>
          <Textarea
            id="comment"
            placeholder="Tell us about a song with similar vibes..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
        </div>

        {/* Song Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Attach a song</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowSongPicker(!showSongPicker)}>
              <Music className="w-4 h-4 mr-2" />
              {selectedSong ? "Change Song" : "Select Song"}
            </Button>
          </div>

          {selectedSong && (
            <div className="p-3 bg-background rounded-lg border border-border">
              <p className="text-xs text-muted-foreground mb-2">Selected song:</p>
              <MusicPlayer song={selectedSong} size="sm" />
            </div>
          )}

          {showSongPicker && (
            <div className="space-y-3 p-3 bg-background rounded-lg border border-border">
              <Input
                placeholder="Search for a song..."
                value={songSearch}
                onChange={(e) => setSongSearch(e.target.value)}
              />
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {filteredSongs.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      setSelectedSong(song)
                      setShowSongPicker(false)
                    }}
                    className="p-2 rounded cursor-pointer hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                        {song.imageUrl ? (
                          <img
                            src={song.imageUrl || "/placeholder.svg"}
                            alt={song.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <Music className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-xs truncate">{song.title}</p>
                        <p className="text-muted-foreground text-xs truncate">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!newComment.trim() || !selectedSong}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
