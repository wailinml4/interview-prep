import { db } from "@/drizzle/db"
import { JobInfoTable, QuestionTable } from "@/drizzle/schema"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { and, desc, eq } from "drizzle-orm"
import z from "zod"

const schema = z.object({
  jobInfoId: z.string().min(1),
})

export async function GET(req: Request) {
  const url = new URL(req.url)
  const result = schema.safeParse({
    jobInfoId: url.searchParams.get("jobInfoId"),
  })

  if (!result.success) {
    return new Response("Invalid jobInfoId", { status: 400 })
  }

  const { jobInfoId } = result.data
  const { userId } = await getCurrentUser()
  if (userId == null) {
    return new Response("You are not logged in", { status: 401 })
  }

  const question = await db.query.QuestionTable.findFirst({
    where: eq(QuestionTable.jobInfoId, jobInfoId),
    orderBy: desc(QuestionTable.createdAt),
    columns: {
      id: true,
    },
    with: {
      jobInfo: {
        columns: {
          userId: true,
        },
      },
    },
  })

  if (question == null) {
    return new Response("No question found", { status: 404 })
  }

  if (question.jobInfo.userId !== userId) {
    return new Response("You do not have permission to do this", {
      status: 403,
    })
  }

  return new Response(JSON.stringify({ questionId: question.id }), {
    headers: { "Content-Type": "application/json" },
  })
}
