import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { randomUUID } from "crypto";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL not found");
    process.exit(1);
  }

  const client = postgres(connectionString);
  const db = drizzle(client, { schema });

  console.log("Connected to DB");

  // Debug: Check DB name and tables
  try {
    const [dbInfo] = await client`SELECT current_database()`;
    console.log("Current Database:", dbInfo.current_database);

    const tables =
      await client`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("Tables in DB:", tables.map((t) => t.table_name).join(", "));
  } catch (e) {
    console.error("Error fetching DB info:", e);
  }

  // 1. Create Test Teacher
  const teacherId = randomUUID();
  console.log(`Creating test teacher: ${teacherId}`);
  await db.insert(schema.user).values({
    id: teacherId,
    name: "Verification Teacher",
    email: `test-${teacherId}@example.com`,
    role: "teacher",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // 2. Create Test Classrooms
  const classroom1Id = randomUUID();
  const classroom2Id = randomUUID();
  console.log(`Creating test classrooms: ${classroom1Id}, ${classroom2Id}`);

  await db.insert(schema.classrooms).values([
    {
      id: classroom1Id,
      name: "Verification Class 1",
      teacherId: teacherId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: classroom2Id,
      name: "Verification Class 2",
      teacherId: teacherId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const classroomIds = [classroom1Id, classroom2Id];

  // 3. Create Homework
  const homeworkID = randomUUID();
  console.log(`Creating homework: ${homeworkID}`);

  // Insert into homeworks (legacy classroomId = first one)
  await db.insert(schema.homeworks).values({
    id: homeworkID,
    teacherId: teacherId,
    title: "Verification Homework",
    subject: "Test Subject",
    classroomId: classroomIds[0], // Fallback
  });

  // Insert into homeworkClassrooms
  for (const cid of classroomIds) {
    await db.insert(schema.homeworkClassrooms).values({
      homeworkId: homeworkID,
      classroomId: cid,
    });
  }

  // 4. Verify
  const associations = await db.query.homeworkClassrooms.findMany({
    where: eq(schema.homeworkClassrooms.homeworkId, homeworkID),
  });

  console.log(`Created ${associations.length} associations.`);

  if (associations.length !== classroomIds.length) {
    console.error("Mismatch in associations!");
    console.error(
      `Expected: ${classroomIds.length}, Found: ${associations.length}`
    );
  } else {
    console.log("Verification PASSED: Associations match.");
  }

  // 5. Cleanup
  console.log("Cleaning up...");
  await db
    .delete(schema.homeworkClassrooms)
    .where(eq(schema.homeworkClassrooms.homeworkId, homeworkID));
  await db.delete(schema.homeworks).where(eq(schema.homeworks.id, homeworkID));
  await db
    .delete(schema.classrooms)
    .where(eq(schema.classrooms.teacherId, teacherId));
  await db.delete(schema.user).where(eq(schema.user.id, teacherId));
  console.log("Cleanup done.");

  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
