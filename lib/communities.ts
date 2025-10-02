import type { Community } from "./types"

export const communities: Community[] = [
  {
    id: "happy",
    name: "Happy Vibes",
    description: "Share songs that make you smile and feel good",
    icon: "☀️",
    color: "bg-yellow-500",
    memberCount: 12500,
  },
  {
    id: "sad",
    name: "Sad Songs",
    description: "For when you need to feel your feelings",
    icon: "🌧️",
    color: "bg-blue-500",
    memberCount: 8900,
  },
  {
    id: "energetic",
    name: "High Energy",
    description: "Pump-up tracks and workout anthems",
    icon: "⚡",
    color: "bg-orange-500",
    memberCount: 15200,
  },
  {
    id: "chill",
    name: "Chill Beats",
    description: "Relaxing music for studying, working, or unwinding",
    icon: "🌊",
    color: "bg-teal-500",
    memberCount: 18700,
  },
  {
    id: "romantic",
    name: "Love Songs",
    description: "Music for the heart and soul",
    icon: "💕",
    color: "bg-pink-500",
    memberCount: 9800,
  },
  {
    id: "angry",
    name: "Rage & Release",
    description: "Heavy, aggressive music to let it all out",
    icon: "🔥",
    color: "bg-red-500",
    memberCount: 6400,
  },
  {
    id: "nostalgic",
    name: "Throwback Tracks",
    description: "Songs that take you back in time",
    icon: "⏰",
    color: "bg-purple-500",
    memberCount: 11300,
  },
  {
    id: "party",
    name: "Party Mode",
    description: "Dance floor bangers and party starters",
    icon: "🎉",
    color: "bg-green-500",
    memberCount: 14600,
  },
]

export function getCommunity(id: string): Community | undefined {
  return communities.find((c) => c.id === id)
}
