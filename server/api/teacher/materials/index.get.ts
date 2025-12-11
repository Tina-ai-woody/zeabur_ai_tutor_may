import { eq, and, isNull, ilike, sql } from "drizzle-orm";
import { classMaterials } from "../../../../db/schema";
import { db } from "../../../../server/utils/db";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const query = getQuery(event);
  const parentId = query.parentId as string | undefined;

  // Search filters
  const keyword = query.keyword as string | undefined;
  const subject = query.subject as string | undefined;
  const chapter = query.chapter as string | undefined;
  const source = query.source as string | undefined;
  const hashtags = query.hashtags as string | undefined;

  const isSearch = keyword || subject || chapter || source || hashtags;

  const conditions = [eq(classMaterials.teacherId, session.user.id)];

  if (isSearch) {
    // If searching, ignore folder structure (global search)
    if (keyword) {
      conditions.push(ilike(classMaterials.name, `%${keyword}%`));
    }
    if (subject) {
      conditions.push(ilike(classMaterials.subject, `%${subject}%`));
    }
    if (chapter) {
      conditions.push(ilike(classMaterials.chapter, `%${chapter}%`));
    }
    if (source) {
      conditions.push(ilike(classMaterials.source, `%${source}%`));
    }
    if (hashtags) {
      // Assuming hashtags is comma separated or single tag search.
      // For JSONB array check:
      // Using sql operator for JSONB contains might be cleaner but simple text search on jsonb cast to text is easier for "contains" behavior if structure is simple
      // or arrayContains if provided by drizzle.
      // Let's use arrayContains from drizzle-orm if available or sql.
      // Drizzle 'arrayContains' is for specific dialects. For PG, `sql`${classMaterials.hashtags} ?& ${[hashtag]}` ` etc.
      // A simpler way for basic search is often just checking if the jsonb array contains the value.
      // Let's try simple sql includes for now or if strict array match is needed.
      // Given user might type partial tag, cast to text and ilike is hacky but user friendly.
      // But standard is Exact Tag match usually.
      // Let's use `sql` to check if JSON array contains value.
      // const tagList = hashtags.split(',').map(t => t.trim());
      // conditions.push(sql`${classMaterials.hashtags} ?| array[${tagList.join(',')}]`);
      // Simpler: just search for one tag at a time in the "hashtag" field from UI.
      // UI sends string.
      // Postgres: `column @> '["value"]'`
      // conditions.push(sql`${classMaterials.hashtags} @> ${JSON.stringify([hashtags])}`);
      // But this requires exact match.
      // Let's stick to ilike on Name/Subject etc. For hashtags let's try strict match or just `column ? val`.
      // Drizzle: `arrayContains(classMaterials.hashtags, [hashtags])`
      // But wait, Drizzle `arrayContains` on jsonb?
      // Let's import `sql` and use raw sql for flexibility if needed, or `arrayContains` if it works on JSONB.
      // Safe bet: sql operator @>

      conditions.push(
        sql`${classMaterials.hashtags} @> ${JSON.stringify([hashtags])}::jsonb`
      );
    }
  } else {
    // Navigation mode
    if (parentId) {
      conditions.push(eq(classMaterials.parentId, parentId));
    } else {
      conditions.push(isNull(classMaterials.parentId));
    }
  }

  const materials = await db
    .select()
    .from(classMaterials)
    .where(and(...conditions))
    .orderBy(classMaterials.isFolder, classMaterials.createdAt);

  return materials.sort((a, b) => {
    if (a.isFolder === b.isFolder) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isFolder ? -1 : 1;
  });
});
