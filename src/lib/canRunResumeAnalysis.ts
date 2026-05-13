import { hasPermission } from "@/lib/hasPermission"

export async function canRunResumeAnalysis() {
  return hasPermission("unlimited_resume_analysis")
}
