import { eq, inArray, or } from "drizzle-orm";
import {
  classrooms,
  classroomStudents,
  homeworks,
  homeworkCompletions,
  homeworkClassrooms,
} from "~~/db/schema";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  const studentId = session.user.id;

  // 1. Find all classrooms the student is in
  const studentClassrooms = await useDrizzle()
    .select()
    .from(classroomStudents)
    .where(eq(classroomStudents.studentId, studentId));

  if (studentClassrooms.length === 0) {
    return [];
  }

  const classroomIds = studentClassrooms.map((sc) => sc.classroomId);

  // 2. Fetch all homeworks for these classrooms
  // Matches either legacy column OR new many-to-many table
  const allHomeworks = await useDrizzle()
    .select({
      id: homeworks.id,
      title: homeworks.title,
      subject: homeworks.subject,
      deadline: homeworks.deadline,
      classroomId: homeworks.classroomId, // Legacy
      createdAt: homeworks.createdAt,
      // We need to know which classroom matched.
      // This is tricky if a homework is assigned to multiple classes the student is in.
      // We will perform a join to get the context.
      matchedClassroomId: homeworkClassrooms.classroomId,
    })
    .from(homeworks)
    .leftJoin(
      homeworkClassrooms,
      eq(homeworks.id, homeworkClassrooms.homeworkId)
    )
    .where(
      or(
        inArray(homeworks.classroomId, classroomIds), // Legacy check
        inArray(homeworkClassrooms.classroomId, classroomIds) // New check
      )
    );

  // 3. Fetch classroom details for grouping
  const classroomDetails = await useDrizzle()
    .select({
      id: classrooms.id,
      name: classrooms.name,
    })
    .from(classrooms)
    .where(inArray(classrooms.id, classroomIds));

  // 4. Fetch completions
  const completions = await useDrizzle()
    .select()
    .from(homeworkCompletions)
    .where(eq(homeworkCompletions.userId, studentId));

  // 5. Group homeworks by classroom
  const result = classroomDetails.map((classroom) => {
    // Filter homeworks that belong to this classroom
    // A homework belongs if:
    // a) matchedClassroomId equals classroom.id (from new table)
    // b) classroomId equals classroom.id (from legacy column)
    // Note: A homework might appear multiple times in allHomeworks if it has multiple entries in homeworkClassrooms,
    // but we filter by specific classroom ID here, so we should distinct strictly by ID.

    const uniqueHomeworks = new Map();

    allHomeworks.forEach((hw) => {
      if (
        hw.matchedClassroomId === classroom.id ||
        hw.classroomId === classroom.id
      ) {
        if (!uniqueHomeworks.has(hw.id)) {
          uniqueHomeworks.set(hw.id, {
            id: hw.id,
            title: hw.title,
            subject: hw.subject,
            deadline: hw.deadline,
            createdAt: hw.createdAt,
            classroomId: classroom.id, // Ensure we report it as part of THIS classroom context
            isCompleted: completions.some(
              (c) => c.homeworkId === hw.id && c.classroomId === classroom.id
            ),
          });
        }
      }
    });

    return {
      classroom,
      homeworks: Array.from(uniqueHomeworks.values()),
    };
  });

  return result;
});
