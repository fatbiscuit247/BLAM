// Spotify Web API integration utilities

export interface SpotifyTrack {
  id: string
  name: string
  artists: { name: string }[]
  album: {
    name: string
    images: { url: string; height: number; width: number }[]
  }
  duration_ms: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
  }
}

class SpotifyAPI {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiry = 0

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || ""
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || ""
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      throw new Error("Failed to get Spotify access token")
    }

    const data = await response.json()
    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000 // Refresh 1 minute early

    return this.accessToken
  }

  async searchTracks(query: string, limit = 20): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getAccessToken()
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to search Spotify tracks")
      }

      const data: SpotifySearchResponse = await response.json()
      return data.tracks.items
    } catch (error) {
      console.error("Spotify search error:", error)
      return []
    }
  }

  async getTrack(trackId: string): Promise<SpotifyTrack | null> {
    try {
      const token = await this.getAccessToken()
      const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to get Spotify track")
      }

      return await response.json()
    } catch (error) {
      console.error("Spotify track fetch error:", error)
      return null
    }
  }

  // Convert Spotify track to our Song interface
  spotifyTrackToSong(track: SpotifyTrack): import("./types").Song {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map((a) => a.name).join(", "),
      album: track.album.name,
      duration: Math.floor(track.duration_ms / 1000),
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      imageUrl: track.album.images[0]?.url,
      genre: undefined, // Spotify doesn't provide genre in basic track info
    }
  }
}

export const spotifyAPI = new SpotifyAPI()
