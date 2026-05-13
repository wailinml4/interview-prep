import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { UserTable } from "@/drizzle/schema"
import { getUser } from "@/lib/actions/users"

type User = typeof UserTable.$inferSelect

type CurrentUserResult = {
  userId: string | null
  user: User | null
  redirectToSignIn: () => never
}

export async function getCurrentUser(options?: { allData?: boolean }): Promise<CurrentUserResult> {
  const { userId } = (await auth()) ?? { userId: null }

  const redirectToSignIn = () => {
    redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in")
  }

  if (!userId) {
    return { userId: null, user: null, redirectToSignIn }
  }

  if (options?.allData) {
    const user = await getUser(userId)
    return { userId, user: user ?? null, redirectToSignIn }
  }

  return { userId, user: null, redirectToSignIn }
}
