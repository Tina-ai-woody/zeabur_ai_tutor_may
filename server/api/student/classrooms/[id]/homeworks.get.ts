import { homeworks, classroomStudents } from "../../../../../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { auth } from "../../../../../server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session || session.user.role !== "student") {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }

  const classroomId = event.context.params?.id;
  if (!classroomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Classroom ID is required",
    });
  }

  // Check enrollment
  const enrollment = await useDrizzle()
    .select()
    .from(classroomStudents)
    .where(
      and(
        eq(classroomStudents.classroomId, classroomId),
        eq(classroomStudents.studentId, session.user.id)
      )
    )
    .limit(1);

  if (enrollment.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not enrolled in this classroom",
    });
  }

  // Fetch homeworks
  const result = await useDrizzle()
    .select()
    .from(homeworks)
    .where(eq(homeworks.classroomId, classroomId))
    .orderBy(desc(homeworks.createdAt));

  return result;
});
