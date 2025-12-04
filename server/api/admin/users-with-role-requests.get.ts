import { db } from "../../../db";
import { user, roleRequests } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuthSession } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);

  if (session.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  const usersWithRequests = await db
    .select({
      userData: user,
      requestedRole: roleRequests.role,
    })
    .from(user)
    .leftJoin(roleRequests, eq(user.id, roleRequests.userId))
    .orderBy(desc(user.createdAt));

  console.log("Fetched users count:", usersWithRequests.length);
  if (usersWithRequests.length > 0) {
    console.log("First user sample:", usersWithRequests[0]);
  }

  return {
    users: usersWithRequests.map((row) => ({
      ...row.userData,
      requestedRole: row.requestedRole,
    })),
  };
});
