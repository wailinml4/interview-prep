import { NewQuestionClientPage } from "@/app/dashboard/job-infos/[jobInfoId]/questions/NewQuestionClientPage"
import { db } from "@/drizzle/db"
import { JobInfoTable } from "@/drizzle/schema"
import { getJobInfoIdTag } from "@/lib/cache/job-infos"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { and, eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { notFound } from "next/navigation"

export default async function EngineeringPage({ params }: { params: Promise<{ jobInfoId: string }> }) {
  const { jobInfoId } = await params
  const { userId, redirectToSignIn } = await getCurrentUser()
  if (!userId) return redirectToSignIn()

  const jobInfo = await getJobInfo(jobInfoId, userId)
  if (!jobInfo) return notFound()

  return <NewQuestionClientPage jobInfo={jobInfo} type="engineering" />
}
async function getJobInfo(jobInfoId: string, userId: string) {
  "use cache"
  cacheTag(getJobInfoIdTag(jobInfoId))

  return db.query.JobInfoTable.findFirst({
    where: and(eq(JobInfoTable.id, jobInfoId), eq(JobInfoTable.userId, userId)),
  })
}
