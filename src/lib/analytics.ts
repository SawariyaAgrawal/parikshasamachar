import { EXAMS } from "@/lib/constants";
import { Profile } from "@/types";

export interface ExamPercentageData {
  examSlug: string;
  examName: string;
  students: number;
  percentage: number;
}

export function getExamPercentages(profiles: Profile[]): ExamPercentageData[] {
  const students = profiles.filter((profile) => profile.role === "student");
  const total = students.length;

  return EXAMS.map((exam) => {
    const count = students.filter((profile) => profile.examSlug === exam.slug).length;
    return {
      examSlug: exam.slug,
      examName: exam.name,
      students: count,
      percentage: total === 0 ? 0 : Number(((count / total) * 100).toFixed(1))
    };
  });
}

export function buildCSV(profiles: Profile[]) {
  const rows = profiles.map((profile) =>
    [
      profile.id,
      profile.fullName,
      profile.email,
      profile.phone,
      profile.city,
      profile.examSlug,
      profile.examYear ?? profile.targetYear ?? "",
      profile.currentCoaching ?? "",
      profile.role,
      profile.createdAt
    ].join(",")
  );

  return [
    "id,full_name,email,phone,city,exam_slug,exam_year,current_coaching,role,created_at",
    ...rows
  ].join("\n");
}
