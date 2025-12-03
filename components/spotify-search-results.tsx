"use client"

import { Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SpotifyPlayer } from "./spotify-player"
import type { Song } from "@/lib/types"

interface SpotifySearchResultsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedSong: Song | null
  onSongSelect: (song: Song) => void
  songs: Song[]
  loading: boolean
  showPicker: boolean
  onTogglePicker: () => void
}

export function SpotifySearchResults({
  searchQuery,
  onSearchChange,
  selectedSong,
  onSongSelect,
  songs,
  loading,
  showPicker,
  onTogglePicker,
}: SpotifySearchResultsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Attach a song</Label>
        <Button type="button" variant="outline" size="sm" onClick={onTogglePicker}>
          <Music className="w-4 h-4 mr-2" />
          {selectedSong ? "Change Song" : "Select Song"}
        </Button>
      </div>

      {selectedSong && (
        <div className="p-3 bg-background rounded-lg border border-border">
          <p className="text-xs text-muted-foreground mb-2">Selected song:</p>
          <SpotifyPlayer song={selectedSong} />
        </div>
      )}

      {showPicker && (
        <div className="space-y-3 p-3 bg-background rounded-lg border border-border">
          <Input
            placeholder="Search for a song on Spotify..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />

          {loading && <div className="text-center py-4 text-sm text-muted-foreground">Searching Spotify...</div>}

          {!loading && songs.length === 0 && searchQuery && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No results found. Try a different search.
            </div>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSongSelect(song)}
                className="p-2 rounded cursor-pointer hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {song.imageUrl ? (
                      <img
                        src={song.imageUrl || "/placeholder.svg"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{song.title}</p>
                    <p className="text-muted-foreground text-xs truncate">{song.artist}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
