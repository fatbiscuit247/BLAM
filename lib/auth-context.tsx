"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signUp: (username: string, email: string, password: string, avatar?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateProfile: (updates: Partial<User>) => void
  joinedCommunities: string[]
  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void
  isMemberOf: (communityId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const USERS_STORAGE_KEY = "blam_users"
const CURRENT_USER_STORAGE_KEY = "blam_current_user"
const MEMBERSHIPS_STORAGE_KEY = "blam_memberships"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(CURRENT_USER_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error("[v0] Error loading current user:", error)
    }
    return null
  })

  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(() => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(MEMBERSHIPS_STORAGE_KEY)
      if (stored) {
        const memberships = JSON.parse(stored)
        return user ? memberships[user.id] || [] : []
      }
    } catch (error) {
      console.error("[v0] Error loading memberships:", error)
    }
    return []
  })

  // Save current user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY)
      }
    } catch (error) {
      console.error("[v0] Error saving current user:", error)
    }
  }, [user])

  // Save memberships to localStorage
  useEffect(() => {
    if (!user) return

    try {
      const stored = localStorage.getItem(MEMBERSHIPS_STORAGE_KEY)
      const allMemberships = stored ? JSON.parse(stored) : {}
      allMemberships[user.id] = joinedCommunities
      localStorage.setItem(MEMBERSHIPS_STORAGE_KEY, JSON.stringify(allMemberships))
    } catch (error) {
      console.error("[v0] Error saving memberships:", error)
    }
  }, [joinedCommunities, user])

  const signUp = async (username: string, email: string, password: string, avatar?: string) => {
    try {
      // Get existing users
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      const users = stored ? JSON.parse(stored) : []

      // Check if email already exists
      if (users.some((u: User) => u.email === email)) {
        throw new Error("Email already exists")
      }

      // Check if username already exists
      if (users.some((u: User) => u.username === username)) {
        throw new Error("Username already taken")
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        username,
        email,
        avatar: avatar || "/music-lover-avatar.png",
        createdAt: new Date(),
      }

      // Save user
      users.push(newUser)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

      // Set as current user
      setUser(newUser)
      setJoinedCommunities([])
    } catch (error) {
      console.error("[v0] Sign up error:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      const users = stored ? JSON.parse(stored) : []

      const foundUser = users.find((u: User) => u.email === email)
      if (!foundUser) {
        throw new Error("Invalid email or password")
      }

      setUser(foundUser)

      // Load user's memberships
      const membershipsStored = localStorage.getItem(MEMBERSHIPS_STORAGE_KEY)
      if (membershipsStored) {
        const allMemberships = JSON.parse(membershipsStored)
        setJoinedCommunities(allMemberships[foundUser.id] || [])
      }
    } catch (error) {
      console.error("[v0] Sign in error:", error)
      throw error
    }
  }

  const signOut = () => {
    setUser(null)
    setJoinedCommunities([])
  }

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)

    // Update in users list
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      const users = stored ? JSON.parse(stored) : []
      const index = users.findIndex((u: User) => u.id === user.id)
      if (index !== -1) {
        users[index] = updatedUser
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    }
  }

  const joinCommunity = (communityId: string) => {
    if (!joinedCommunities.includes(communityId)) {
      setJoinedCommunities((prev) => [...prev, communityId])
    }
  }

  const leaveCommunity = (communityId: string) => {
    setJoinedCommunities((prev) => prev.filter((id) => id !== communityId))
  }

  const isMemberOf = (communityId: string) => {
    return joinedCommunities.includes(communityId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signUp,
        signIn,
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
