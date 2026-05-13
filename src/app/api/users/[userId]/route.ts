import { auth } from "@clerk/nextjs/server"
import { upsertUser } from "@/lib/db/users"
import { db } from "@/drizzle/db"
import { UserTable } from "@/drizzle/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

type ClerkUser = {
  id: string
  first_name: string | null
  last_name: string | null
  image_url: string | null
  created_at: string
  updated_at: string
  email_addresses: Array<{ id: string; email_address: string }>
  primary_email_address_id: string | null
}

async function fetchClerkUser(userId: string): Promise<ClerkUser | null> {
  const secret = process.env.CLERK_SECRET_KEY

  if (!secret) {
    console.error("CLERK_SECRET_KEY is missing")
    return null
  }

  const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`, {
    headers: {
      Authorization: `Bearer ${secret}`,
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    console.error("Failed to fetch Clerk user", response.status, await response.text())
    return null
  }

  return response.json()
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params

  let user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, userId),
  })

  if (user == null) {
    console.log("API /api/users/[userId] no user row yet for", userId)

    const { userId: authUserId } = await auth()

    if (authUserId === userId) {
      const clerkUser = await fetchClerkUser(userId)

      if (clerkUser != null) {
        const email = clerkUser.email_addresses.find(
          e => e.id === clerkUser.primary_email_address_id
        )?.email_address

        if (email != null) {
          await upsertUser({
            id: clerkUser.id,
            email,
            name: `${clerkUser.first_name ?? ""} ${clerkUser.last_name ?? ""}`.trim(),
            imageUrl: clerkUser.image_url ?? "",
            createdAt: new Date(clerkUser.created_at),
            updatedAt: new Date(clerkUser.updated_at),
          })

          user = await db.query.UserTable.findFirst({
            where: eq(UserTable.id, userId),
          })
        }
      }
    }
  }

  if (user == null) {
    return NextResponse.json(null)
  }

  return NextResponse.json(user)
}
