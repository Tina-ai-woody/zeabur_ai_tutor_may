import { eq, desc } from "drizzle-orm";
import { homeworks, classrooms } from "../../../db/schema";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const { user } = session;

  if (user.role !== "teacher") {
    throw createError({
      statusCode: 403,
      message: "Only teachers can access this endpoint",
    });
  }

  try {
    const result = await useDrizzle()
      .select({
        id: homeworks.id,
        title: homeworks.title,
        subject: homeworks.subject,
        deadline: homeworks.deadline,
        createdAt: homeworks.createdAt,
        classroomName: classrooms.name,
        classroomId: classrooms.id,
      })
      .from(homeworks)
      .leftJoin(classrooms, eq(homeworks.classroomId, classrooms.id))
      .where(eq(homeworks.teacherId, user.id))
      .orderBy(desc(homeworks.createdAt));

    return result;
  } catch (error) {
    console.error("Error fetching homeworks:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch homeworks",
    });
  }
});
