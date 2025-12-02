import { user, classroomStudents, classrooms } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { auth } from "../../../server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session || session.user.role !== "teacher") {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }

  const teacherId = session.user.id;

  const students = await useDrizzle()
    .selectDistinct({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .innerJoin(classroomStudents, eq(user.id, classroomStudents.studentId))
    .innerJoin(classrooms, eq(classroomStudents.classroomId, classrooms.id))
    .where(eq(classrooms.teacherId, teacherId));

  return students;
});
