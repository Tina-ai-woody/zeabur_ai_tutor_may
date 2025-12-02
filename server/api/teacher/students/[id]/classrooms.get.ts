import { classrooms, classroomStudents, user } from "../../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "../../../../../server/utils/auth";

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
  const studentId = getRouterParam(event, "id");

  if (!studentId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Student ID is required",
    });
  }

  // Security check: Ensure the teacher has at least one common classroom with the student
  // or simply check if the student is in any of the teacher's classrooms.
  const isMyStudent = await useDrizzle()
    .select({ id: classroomStudents.id })
    .from(classroomStudents)
    .innerJoin(classrooms, eq(classroomStudents.classroomId, classrooms.id))
    .where(
      and(
        eq(classroomStudents.studentId, studentId),
        eq(classrooms.teacherId, teacherId)
      )
    )
    .limit(1);

  if (isMyStudent.length === 0) {
    throw createError({
      statusCode: 403,
      statusMessage: "You are not authorized to view this student's details",
    });
  }

  // Fetch all classrooms the student is enrolled in
  const studentClassrooms = await useDrizzle()
    .select({
      id: classrooms.id,
      name: classrooms.name,
      description: classrooms.description,
      teacherName: user.name, // Fetch the teacher's name for each classroom
      joinedAt: classroomStudents.joinedAt,
    })
    .from(classroomStudents)
    .innerJoin(classrooms, eq(classroomStudents.classroomId, classrooms.id))
    .innerJoin(user, eq(classrooms.teacherId, user.id))
    .where(eq(classroomStudents.studentId, studentId));

  return studentClassrooms;
});
