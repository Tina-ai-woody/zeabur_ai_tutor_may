import { eq, desc, and } from "drizzle-orm";
import { db } from "../../../../../server/utils/db";
import { posts } from "../../../../../db/schema";

export default defineEventHandler(async (event) => {
  const { id: classroomId } = getRouterParams(event);

  if (!classroomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Classroom ID is required",
    });
  }

  const postsList = await db
    .select({
      id: posts.id,
      content: posts.content,
      classDate: posts.classDate,
      classStartTime: posts.classStartTime,
      classEndTime: posts.classEndTime,
      classLength: posts.classLength,
      createdAt: posts.createdAt,
      attendees: posts.attendees,
    })
    .from(posts)
    .where(eq(posts.classroomId, classroomId))
    .orderBy(desc(posts.createdAt));

  return postsList;
});
