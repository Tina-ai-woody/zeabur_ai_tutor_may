import { eq, and } from "drizzle-orm";
import {
  classrooms,
  classMaterials,
  classroomMaterials,
} from "../../../../../db/schema";
import { db } from "../../../../../server/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const classroomId = getRouterParam(event, "id");

  if (!classroomId) {
    throw createError({
      statusCode: 400,
      message: "Missing classroomId",
    });
  }

  // Verify ownership of classroom
  const [classroom] = await db
    .select()
    .from(classrooms)
    .where(
      and(
        eq(classrooms.id, classroomId),
        eq(classrooms.teacherId, session.user.id)
      )
    );

  if (!classroom) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized or classroom not found",
    });
  }

  // Join with validation for parent checking
  const query = getQuery(event);
  const parentId = query.parentId as string | undefined;

  let materials;

  if (parentId) {
    // 1. Fetch parent folder details to get its path
    const [parentFolder] = await db
      .select()
      .from(classMaterials)
      .where(eq(classMaterials.id, parentId))
      .limit(1);

    if (!parentFolder) {
      throw createError({ statusCode: 404, message: "Folder not found" });
    }

    // 2. Fetch all shared roots for this classroom to verify access
    const sharedRoots = await db
      .select({
        path: classMaterials.path,
      })
      .from(classroomMaterials)
      .innerJoin(
        classMaterials,
        eq(classroomMaterials.materialId, classMaterials.id)
      )
      .where(eq(classroomMaterials.classroomId, classroomId));

    // 3. Verify access: Check if parentFolder is a descendant of any shared root
    const isAccessible = sharedRoots.some((root) =>
      parentFolder.path.startsWith(root.path)
    );

    if (!isAccessible) {
      // Also check if the parentId IS one of the shared roots (direct match handled by startsWith if paths match exactly, but let's be safe)
      // Actually startsWith includes exact match usually if not checking slash.
      // But let's check validation strictly.
      throw createError({
        statusCode: 403,
        message: "Unauthorized access to material",
      });
    }

    // 4. Fetch children
    materials = await db
      .select({
        id: classMaterials.id,
        name: classMaterials.name,
        type: classMaterials.type,
        isFolder: classMaterials.isFolder,
        url: classMaterials.url,
        sharedAt: classMaterials.createdAt, // Just use createdAt for sorting
      })
      .from(classMaterials)
      .where(eq(classMaterials.parentId, parentId))
      .orderBy(classMaterials.isFolder, classMaterials.createdAt);
  } else {
    // Fetch shared roots
    materials = await db
      .select({
        id: classMaterials.id,
        name: classMaterials.name,
        type: classMaterials.type,
        isFolder: classMaterials.isFolder,
        url: classMaterials.url,
        sharedAt: classroomMaterials.createdAt,
      })
      .from(classroomMaterials)
      .innerJoin(
        classMaterials,
        eq(classroomMaterials.materialId, classMaterials.id)
      )
      .where(eq(classroomMaterials.classroomId, classroomId))
      .orderBy(classroomMaterials.createdAt);
  }

  // Sort: Folders first
  return materials.sort((a, b) => {
    // Basic sorting if db doesn't handle mixed types well
    if (a.isFolder === b.isFolder) return 0; // Keep DB order
    return a.isFolder ? -1 : 1;
  });
});
