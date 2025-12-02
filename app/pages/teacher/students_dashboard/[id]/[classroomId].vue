<script setup lang="ts">
definePageMeta({
  layout: "teacher",
});

const route = useRoute();
const studentId = route.params.id as string;
const classroomId = route.params.classroomId as string;

const {
  data: performance,
  pending,
  error,
} = await useFetch(
  `/api/teacher/students/${studentId}/classrooms/${classroomId}/performance`
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "badge-success";
    case "Late":
      return "badge-warning";
    case "Overdue":
      return "badge-error";
    default:
      return "badge-ghost";
  }
};
</script>

<template>
  <div class="container mx-auto p-4 md:p-6">
    <div class="mb-4">
      <NuxtLink
        :to="`/teacher/students_dashboard/${studentId}`"
        class="btn btn-ghost btn-sm gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Student Classrooms
      </NuxtLink>
    </div>

    <div v-if="pending" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>Error loading performance data: {{ error.message }}</span>
    </div>

    <div v-else-if="performance" class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">
          {{ performance.student.name }}'s Performance
        </h1>
        <p class="text-lg opacity-70 mt-1">
          Classroom:
          <span class="font-semibold">{{ performance.classroom.name }}</span>
        </p>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Average Score</div>
            <div class="stat-value text-primary">
              {{ performance.summary.averageScore }}%
            </div>
            <div class="stat-desc">Across all homeworks</div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Completion Rate</div>
            <div class="stat-value text-secondary">
              {{ performance.summary.completionRate }}%
            </div>
            <div class="stat-desc">
              {{ performance.summary.completedHomeworks }} /
              {{ performance.summary.totalHomeworks }} tasks
            </div>
          </div>
        </div>

        <div class="stats shadow">
          <div class="stat">
            <div class="stat-figure text-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-8 h-8 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="stat-title">Late Submissions</div>
            <div class="stat-value text-warning">
              {{ performance.summary.lateHomeworks }}
            </div>
            <div class="stat-desc">Tasks submitted after deadline</div>
          </div>
        </div>
      </div>

      <!-- Homework List -->
      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body">
          <h2 class="card-title mb-4">Homework History</h2>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Homework</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Submitted</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hw in performance.homeworks" :key="hw.id">
                  <td class="font-bold">{{ hw.title || "Untitled" }}</td>
                  <td>
                    <div class="badge" :class="getStatusColor(hw.status)">
                      {{ hw.status }}
                    </div>
                  </td>
                  <td>
                    <div
                      class="radial-progress text-primary text-xs"
                      :style="`--value:${hw.score}; --size:2rem;`"
                    >
                      {{ hw.score }}%
                    </div>
                  </td>
                  <td>
                    {{
                      hw.completedAt
                        ? new Date(hw.completedAt).toLocaleDateString()
                        : "-"
                    }}
                  </td>
                  <td>
                    <span
                      :class="{
                        'text-error':
                          hw.status === 'Overdue' || hw.status === 'Late',
                      }"
                    >
                      {{
                        hw.deadline
                          ? new Date(hw.deadline).toLocaleDateString()
                          : "No deadline"
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            v-if="performance.homeworks.length === 0"
            class="text-center py-10 opacity-50"
          >
            <p>No homeworks assigned in this classroom yet.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
