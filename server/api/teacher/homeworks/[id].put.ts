import { homeworks } from "../../../../db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "../../../../server/utils/auth";

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

  const homeworkId = event.context.params?.id;
  if (!homeworkId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Homework ID is required",
    });
  }

  const body = await readBody(event);
  const { title, subject, deadline, classroomId } = body;

  if (!title || !classroomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title and Classroom are required",
    });
  }

  try {
    // Verify ownership and update
    const result = await useDrizzle()
      .update(homeworks)
      .set({
        title,
        subject,
        deadline: deadline ? new Date(deadline) : null,
        classroomId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(homeworks.id, homeworkId),
          eq(homeworks.teacherId, session.user.id)
        )
      )
      .returning();

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: "Homework not found or unauthorized",
      });
    }

    return { success: true, homework: result[0] };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to update homework",
    });
  }
});
