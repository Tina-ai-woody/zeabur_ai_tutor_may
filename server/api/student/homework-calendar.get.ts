import { eq, inArray } from "drizzle-orm";
import { db } from "../../../db";
import { classroomStudents, homeworks } from "../../../db/schema";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const userId = session.user.id;

  // 1. Get all classrooms the student is in
  const studentClassrooms = await db
    .select({ classroomId: classroomStudents.classroomId })
    .from(classroomStudents)
    .where(eq(classroomStudents.studentId, userId));

  if (studentClassrooms.length === 0) {
    return [];
  }

  const classroomIds = studentClassrooms.map((c) => c.classroomId);

  // 2. Get all homeworks for those classrooms
  const homeworkList = await db
    .select()
    .from(homeworks)
    .where(inArray(homeworks.classroomId, classroomIds));

  // 3. Map to FullCalendar events
  const events = homeworkList
    .filter((hw) => hw.deadline) // Filter out homeworks without a deadline
    .map((hw) => ({
      id: hw.id,
      title: `${hw.subject ? `[${hw.subject}] ` : ""}${hw.title}`,
      start: hw.deadline as Date, // Assert as Date since we filtered
      allDay: true,
    }));

  return events;
});
