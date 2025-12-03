"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"
import { createBrowserClient } from "./supabase/client"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signUp: (username: string) => Promise<void>
  signOut: () => void
  updateProfile: (updates: Partial<User>) => void
  joinedCommunities: string[]
  joinCommunity: (communityId: string) => Promise<void>
  leaveCommunity: (communityId: string) => Promise<void>
  isMemberOf: (communityId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserClient()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem("blam_user_id")
        if (userId) {
          const { data: profile } = await supabase.from("users").select("*").eq("id", userId).single()

          if (profile) {
            setUser({
              id: profile.id,
              username: profile.username,
              email: profile.email || "",
              avatar: profile.avatar,
              createdAt: new Date(profile.created_at),
            })

            // Load memberships
            const { data: memberships } = await supabase
              .from("community_memberships")
              .select("community_id")
              .eq("user_id", userId)

            if (memberships) {
              setJoinedCommunities(memberships.map((m) => m.community_id))
            }
          }
        }
      } catch (error) {
        console.error("[v0] Error loading user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  const signUp = async (username: string) => {
    try {
      const { data: existing } = await supabase.from("users").select("username").eq("username", username).single()

      if (existing) {
        throw new Error("Username already taken")
      }

      const newUser = {
        username,
        email: `${username}@blam.local`,
        avatar: "/music-lover-avatar.png",
      }

      const { data, error } = await supabase.from("users").insert(newUser).select().single()

      if (error) throw error
      if (!data) throw new Error("Failed to create user")

      const userObj: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        createdAt: new Date(data.created_at),
      }

      setUser(userObj)
      setJoinedCommunities([])
      localStorage.setItem("blam_user_id", data.id)
    } catch (error) {
      console.error("[v0] Sign up error:", error)
      throw error
    }
  }

  const signOut = () => {
    localStorage.removeItem("blam_user_id")
    setUser(null)
    setJoinedCommunities([])
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          username: updates.username,
          avatar: updates.avatar,
        })
        .eq("id", user.id)

      if (error) throw error

      setUser({ ...user, ...updates })
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
      throw error
    }
  }

  const joinCommunity = async (communityId: string) => {
    if (!user) return
    if (joinedCommunities.includes(communityId)) return

    try {
      const { error } = await supabase.from("community_memberships").insert({
        user_id: user.id,
        community_id: communityId,
      })

      if (error) throw error

      setJoinedCommunities((prev) => [...prev, communityId])
    } catch (error) {
      console.error("[v0] Error joining community:", error)
      throw error
    }
  }

  const leaveCommunity = async (communityId: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("community_memberships")
        .delete()
        .eq("user_id", user.id)
        .eq("community_id", communityId)

      if (error) throw error

      setJoinedCommunities((prev) => prev.filter((id) => id !== communityId))
    } catch (error) {
      console.error("[v0] Error leaving community:", error)
      throw error
    }
  }

  const isMemberOf = (communityId: string) => {
    return joinedCommunities.includes(communityId)
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp,
        signOut,
        updateProfile,
        joinedCommunities,
        joinCommunity,
        leaveCommunity,
        isMemberOf,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
