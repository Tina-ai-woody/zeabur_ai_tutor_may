import { classMaterials } from "../../../../db/schema";
import { db } from "../../../utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const body = await readBody(event);

  const { name, parentId } = body;

  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Folder name is required",
    });
  }

  // Calculate path
  let parentPath = "";
  if (parentId) {
    const parent = await db.query.classMaterials.findFirst({
      where: (cm, { eq }) => eq(cm.id, parentId),
    });
    if (parent) {
      parentPath = parent.path;
    }
  }

  const path = parentPath ? `${parentPath}${name}/` : `${name}/`;

  const [newFolder] = await db
    .insert(classMaterials)
    .values({
      teacherId: session.user.id,
      name,
      path, // Logical path, maybe suffix with / for folders
      isFolder: true,
      parentId: parentId || null,
      type: "folder",
    })
    .returning();

  return newFolder;
});
