import { classrooms, classroomStudents } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "../../../server/utils/auth";

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

  const result = await useDrizzle()
    .select({
      id: classrooms.id,
      name: classrooms.name,
      description: classrooms.description,
      teacherId: classrooms.teacherId,
      createdAt: classrooms.createdAt,
      updatedAt: classrooms.updatedAt,
    })
    .from(classroomStudents)
    .innerJoin(classrooms, eq(classroomStudents.classroomId, classrooms.id))
    .where(eq(classroomStudents.studentId, session.user.id))
    .orderBy(desc(classroomStudents.joinedAt));

  return result;
});
