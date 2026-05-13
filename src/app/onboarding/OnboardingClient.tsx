"use client"

import { Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

async function fetchUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`, { cache: "no-store" })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error("Unable to load user status")
  }

  return response.json()
}

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter()
  const attemptsRef = useRef(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let intervalId: number | undefined

    const checkUser = async () => {
      if (attemptsRef.current >= 12) {
        setError("Still waiting for onboarding. Check webhook configuration and server logs.")
        if (intervalId != null) window.clearInterval(intervalId)
        return
      }

      attemptsRef.current += 1

      try {
        const user = await fetchUser(userId)
        if (user == null) return

        if (intervalId != null) window.clearInterval(intervalId)
        router.replace("/dashboard")
      } catch (err) {
        setError("Failed to check onboarding status. See console for details.")
        if (intervalId != null) window.clearInterval(intervalId)
        console.error(err)
      }
    }

    checkUser()
    intervalId = window.setInterval(checkUser, 2000)

    return () => {
      if (intervalId != null) window.clearInterval(intervalId)
    }
  }, [userId, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <Loader2Icon className="animate-spin size-24" />
      {error ? <p className="text-sm text-destructive">{error}</p> : <p className="text-sm text-muted-foreground">Waiting for onboarding to complete…</p>}
    </div>
  )
}
