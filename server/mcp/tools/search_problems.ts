import { db } from "../../../db";
import { problems } from "../../../db/schema";
import { and, ilike, sql } from "drizzle-orm";
import { z } from "zod";

export default defineMcpTool({
  name: "search_problems",
  description:
    "Search for problems in the question bank by title, source, or hashtag.",
  inputSchema: {
    title: z.string().optional().describe("Filter by problem title"),
    source: z.string().optional().describe("Filter by problem source"),
    hashtag: z.string().optional().describe("Filter by hashtag"),
  },
  handler: async (args) => {
    const filters = [];

    if (args.title) {
      filters.push(ilike(problems.title, `%${args.title}%`));
    }
    if (args.source) {
      filters.push(ilike(problems.source, `%${args.source}%`));
    }
    if (args.hashtag) {
      filters.push(
        sql`${problems.hashtags} @> ${JSON.stringify([args.hashtag])}`
      );
    }

    try {
      const results = await db
        .select({
          id: problems.id,
          title: problems.title,
          difficulty: problems.difficulty,
          source: problems.source,
          hashtags: problems.hashtags,
        })
        .from(problems)
        .where(filters.length > 0 ? and(...filters) : undefined)
        .limit(10); // Limit results to avoid overwhelming the context

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching problems: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  },
});
