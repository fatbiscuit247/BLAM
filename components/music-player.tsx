"use client"

import { useState } from "react"
import { Play, Pause, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Song } from "@/lib/types"
import { SpotifyPlayer } from "./spotify-player"

interface MusicPlayerProps {
  song: Song
  size?: "sm" | "md" | "lg"
}

export function MusicPlayer({ song, size = "md" }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // In a real app, this would control actual audio playback
  }

  const sizeClasses = {
    sm: "h-12",
    md: "h-16",
    lg: "h-20",
  }

  const imageSize = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  }

  const buttonSize = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const PlayerComponent =
    song.spotifyUrl || song.previewUrl
      ? SpotifyPlayer
      : () => (
          <div
            className={`flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200/20 ${sizeClasses[size]}`}
          >
            <div
              className={`relative ${imageSize[size]} rounded-md overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0`}
            >
              {song.imageUrl ? (
                <img
                  src={song.imageUrl || "/placeholder.svg"}
                  alt={`${song.title} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Volume2 className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground truncate text-sm">{song.title}</h4>
              <p className="text-muted-foreground text-xs truncate">{song.artist}</p>
              {song.album && size !== "sm" && (
                <p className="text-muted-foreground text-xs truncate opacity-75">{song.album}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className={`${buttonSize[size]} rounded-full bg-purple-500 hover:bg-purple-600 text-white`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </Button>
          </div>
        )

  return <PlayerComponent song={song} size={size} />
}
