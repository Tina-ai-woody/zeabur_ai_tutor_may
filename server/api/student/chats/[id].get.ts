import { db } from "../../../../db";
import { chatHistory } from "../../../../db/schema";

import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const user = session.user;
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Chat ID is required",
    });
  }

  try {
    const chat = await db.query.chatHistory.findFirst({
      where: and(eq(chatHistory.id, id), eq(chatHistory.studentId, user.id)),
    });

    if (!chat) {
      throw createError({
        statusCode: 404,
        statusMessage: "Chat not found",
      });
    }

    return chat;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching chat: ${error.message}`,
    });
  }
});
