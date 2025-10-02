import { type NextRequest, NextResponse } from "next/server"
import { spotifyAPI } from "@/lib/spotify"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const tracks = await spotifyAPI.searchTracks(query, limit)
    const songs = tracks.map((track) => spotifyAPI.spotifyTrackToSong(track))

    return NextResponse.json({ songs })
  } catch (error) {
    console.error("Spotify search API error:", error)
    return NextResponse.json({ error: "Failed to search tracks" }, { status: 500 })
  }
}
