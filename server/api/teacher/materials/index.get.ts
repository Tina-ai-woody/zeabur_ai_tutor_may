import { eq, and, isNull } from "drizzle-orm";
import { classMaterials } from "../../../../db/schema";
import { db } from "../../../../server/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const query = getQuery(event);
  const parentId = query.parentId as string | undefined;

  // Ensure user is a teacher? (Should be handled by middleware or check role)
  // For now assume teacher requires auth.

  const conditions = [eq(classMaterials.teacherId, session.user.id)];

  if (parentId) {
    conditions.push(eq(classMaterials.parentId, parentId));
  } else {
    conditions.push(isNull(classMaterials.parentId));
  }

  const materials = await db
    .select()
    .from(classMaterials)
    .where(and(...conditions))
    .orderBy(classMaterials.isFolder, classMaterials.createdAt);

  // Separate folders and files if needed or just return list.
  // Sorting: Folders first (desc by isFolder boolean? true > false? boolean sort varies)
  // PG sort boolean: false < true. So desc puts true (folder) first.
  // Let's refine orderBy: .orderBy(desc(classMaterials.isFolder), desc(classMaterials.createdAt))

  return materials.sort((a, b) => {
    if (a.isFolder === b.isFolder) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isFolder ? -1 : 1;
  });
});
