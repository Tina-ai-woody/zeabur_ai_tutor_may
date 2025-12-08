import { db } from "../../../../../server/utils/db";
import { posts } from "../../../../../db/schema";

export default defineEventHandler(async (event) => {
  const { id: classroomId } = getRouterParams(event);
  const body = await readBody(event);
  const session = await requireAuthSession(event);

  console.log("Creating post. Body:", body);
  console.log("Classroom ID:", classroomId);
  console.log("Session User:", session?.user);

  if (!classroomId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Classroom ID is required",
    });
  }

  // Basic validation
  if (
    !body.content ||
    !body.classDate ||
    !body.classStartTime ||
    !body.classEndTime
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Content, Date, Start Time, and End Time are required",
    });
  }

  const newPost = await db
    .insert(posts)
    .values({
      classroomId,
      teacherId: session.user.id,
      content: body.content,
      classDate: body.classDate,
      classStartTime: body.classStartTime,
      classEndTime: body.classEndTime,
      classLength: body.classLength ? parseInt(body.classLength) : null,
      attendees: body.attendees || [],
    })
    .returning();

  return newPost[0];
});
