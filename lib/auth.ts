import type { User } from "./types"
import { currentUser } from "./mock-data"

// Mock authentication functions
export function getCurrentUser(): User | null {
  return currentUser
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export async function signIn(email: string, password: string): Promise<User> {
  // Mock sign in - in real app this would call your auth service
  return new Promise((resolve) => {
    setTimeout(() => resolve(currentUser), 1000)
  })
}

export async function signOut(): Promise<void> {
  // Mock sign out
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}
