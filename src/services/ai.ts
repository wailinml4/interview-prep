import { JobInfoTable } from "@/drizzle/schema"
import { streamObject } from "ai"
import { google } from "@/services/google"
import { aiAnalyzeSchema } from "@/schemas/aiAnalyze"
import { resumeAnalysisPrompt } from "@/lib/prompts/resumeAnalysis"

export async function analyzeResumeForJob({
  resumeFile,
  jobInfo,
}: {
  resumeFile: File
  jobInfo: Pick<
    typeof JobInfoTable.$inferSelect,
    "title" | "experienceLevel" | "description"
  >
}) {
  return streamObject({
    model: google("gemini-2.5-flash"),
    schema: aiAnalyzeSchema,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "file",
            data: await resumeFile.arrayBuffer(),
            mediaType: resumeFile.type,
          },
        ],
      },
    ],
    system: resumeAnalysisPrompt(jobInfo),
  })
}
