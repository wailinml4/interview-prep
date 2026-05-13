import { getCurrentUser } from "@/lib/getCurrentUser"

export async function hasPermission(
  userOrAction: { id: string } | string | null,
  maybeAction?: string
): Promise<boolean> {
  let user: { id: string } | null = null
  let action: string | undefined = maybeAction

  if (typeof userOrAction === "string") {
    action = userOrAction
    const cu = await getCurrentUser()
    user = cu.userId ? { id: cu.userId } : null
  } else {
    user = userOrAction
  }

  if (!action) return false
  if (!user) return false

  // Simple policy: authenticated users have permissions by default.
  // Replace with real checks when needed.
  return true
}
