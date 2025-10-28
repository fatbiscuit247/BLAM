"use client"
import { ProfileContent } from "@/components/profile-content"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  return <ProfileContent username={username} />
}
