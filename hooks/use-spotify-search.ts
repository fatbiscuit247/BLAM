"use client"

import { useState, useEffect } from "react"
import type { Song } from "@/lib/types"

export function useSpotifySearch(query: string, enabled = true) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim() || !enabled) {
      setSongs([])
      return
    }

    const searchTracks = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&limit=10`)

        if (!response.ok) {
          throw new Error("Failed to search tracks")
        }

        const data = await response.json()
        setSongs(data.songs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed")
        setSongs([])
      } finally {
        setLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchTracks, 300)
    return () => clearTimeout(timeoutId)
  }, [query, enabled])

  return { songs, loading, error }
}
