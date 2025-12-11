import { and, eq, desc, inArray, or } from "drizzle-orm";
import * as tables from "../../../../../db/schema";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  if (session.user.role !== "teacher") {
    throw createError({
      statusCode: 403,
      message: "Only teachers can access this resource",
    });
  }

  const classroomId = getRouterParam(event, "id");
  if (!classroomId) {
    throw createError({
      statusCode: 400,
      message: "Classroom ID is required",
    });
  }

  // Verify that the classroom belongs to the teacher
  const [classroom] = await useDrizzle()
    .select()
    .from(tables.classrooms)
    .where(
      and(
        eq(tables.classrooms.id, classroomId),
        eq(tables.classrooms.teacherId, session.user.id)
      )
    );

  if (!classroom) {
    throw createError({
      statusCode: 404,
      message: "Classroom not found or access denied",
    });
  }

  // Fetch homeworks for the classroom
  // A homework belongs if:
  // a) homeworks.classroomId == classroomId (Legacy)
  // b) homework_classrooms has entry (homeworkId, classroomId)

  // To avoid duplicates if we join, we need to be careful.
  // Let's use EXISTS or a distinct select if possible, or just specific filtering conditions.
  // Actually, since we want homeworks for ONE specific classroom, we can simple join or use subquery.

  const homeworks = await useDrizzle()
    .selectDistinct({
      id: tables.homeworks.id,
      classroomId: tables.homeworks.classroomId,
      teacherId: tables.homeworks.teacherId,
      subject: tables.homeworks.subject,
      title: tables.homeworks.title,
      deadline: tables.homeworks.deadline,
      createdAt: tables.homeworks.createdAt,
      updatedAt: tables.homeworks.updatedAt,
    })
    .from(tables.homeworks)
    .leftJoin(
      tables.homeworkClassrooms,
      eq(tables.homeworks.id, tables.homeworkClassrooms.homeworkId)
    )
    .where(
      or(
        eq(tables.homeworks.classroomId, classroomId),
        eq(tables.homeworkClassrooms.classroomId, classroomId)
      )
    )
    .orderBy(desc(tables.homeworks.createdAt));

  return homeworks;
});
