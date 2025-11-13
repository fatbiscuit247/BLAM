"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Song } from "@/lib/types"

interface SpotifyPlayerProps {
  song: Song
  size?: "sm" | "md" | "lg"
}

export function SpotifyPlayer({ song, size = "md" }: SpotifyPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio || !song.previewUrl) {
      return
    }

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      setIsPlaying(false)
    }
  }

  const openSpotify = () => {
    if (song.spotifyUrl) {
      window.open(song.spotifyUrl, "_blank")
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-200/20 ${sizeClasses[size]}`}
    >
      {/* Hidden audio element for preview playback */}
      {song.previewUrl && <audio ref={audioRef} src={song.previewUrl} preload="metadata" />}

      <div
        className={`relative ${imageSize[size]} rounded-md overflow-hidden bg-gradient-to-br from-green-400 to-green-500 flex-shrink-0`}
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

        {size !== "sm" && !song.previewUrl && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Listen on Spotify</p>
        )}

        {/* Progress bar for larger sizes when preview is available */}
        {size !== "sm" && duration > 0 && song.previewUrl && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        {song.previewUrl ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className={`${buttonSize[size]} rounded-full bg-green-500 hover:bg-green-600 text-white`}
            title={isPlaying ? "Pause preview" : "Play 30s preview"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </Button>
        ) : (
          /* Show Spotify link as primary action when no preview */
          song.spotifyUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={openSpotify}
              className={`${buttonSize[size]} rounded-full bg-green-500 hover:bg-green-600 text-white`}
              title="Listen on Spotify"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )
        )}

        {/* Spotify link button when preview is available */}
        {song.spotifyUrl && song.previewUrl && size !== "sm" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={openSpotify}
            className="h-8 w-8 rounded-full hover:bg-green-100"
            title="Open in Spotify"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  )
}
