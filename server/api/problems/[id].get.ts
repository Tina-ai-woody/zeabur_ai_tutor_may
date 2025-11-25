import { db } from "../../../db";
import { problems } from "../../../db/schema";
import { auth } from "../../../server/utils/auth";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing problem ID",
    });
  }

  const problem = await db
    .select({
      id: problems.id,
      title: problems.title,
      content: problems.content,
      choices: problems.choices,
      difficulty: problems.difficulty,
      source: problems.source,
      imageUrl: problems.imageUrl,
      // We explicitly DO NOT return correctAnswer or explanation here
    })
    .from(problems)
    .where(eq(problems.id, id))
    .limit(1);

  if (!problem.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Problem not found",
    });
  }

  return problem[0];
});
