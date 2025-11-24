import { db } from "../../../db";
import { problems, submissions } from "../../../db/schema";
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

  const body = await readBody(event);
  const { problemId, userAnswer } = body;

  if (!problemId || !userAnswer) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing problemId or userAnswer",
    });
  }

  // Fetch the problem to check the answer
  const problem = await db
    .select()
    .from(problems)
    .where(eq(problems.id, problemId))
    .limit(1);

  if (!problem.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Problem not found",
    });
  }

  const isCorrect = problem[0].correctAnswer === userAnswer;

  // Record the submission
  await db.insert(submissions).values({
    userId: session.user.id,
    problemId: problemId,
    userAnswer: userAnswer,
    isCorrect: isCorrect,
  });

  return {
    correct: isCorrect,
    explanation: problem[0].explanation, // Return official explanation
    correctAnswer: problem[0].correctAnswer, // Reveal correct answer
  };
});
