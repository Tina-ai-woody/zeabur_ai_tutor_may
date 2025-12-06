import { db } from "../../../../db";
import { chatHistory } from "../../../../db/schema";

import { eq, desc } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const user = session.user;

  try {
    const chats = await db
      .select({
        id: chatHistory.id,
        title: chatHistory.title,
        createdAt: chatHistory.createdAt,
        updatedAt: chatHistory.updatedAt,
      })
      .from(chatHistory)
      .where(eq(chatHistory.studentId, user.id))
      .orderBy(desc(chatHistory.updatedAt));

    return chats;
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Error fetching chats: ${error.message}`,
    });
  }
});
