<script setup lang="ts">
definePageMeta({
  layout: "teacher",
});

const route = useRoute();
const studentId = route.params.id as string;

// Fetch student's classrooms
const {
  data: classrooms,
  pending,
  error,
} = await useFetch(`/api/teacher/students/${studentId}/classrooms`);

// We might also want to fetch the student's basic info to display their name at the top
// Since we don't have a dedicated single student endpoint that returns just info without auth checks for "my student" specifically logic again (though we could reuse one),
// or we can just pass the name via query param or state, but fetching is cleaner.
// For now, let's assume we just show "Student Details" or try to find the student name from the list if we had a store, but we don't.
// Let's create a small helper or just display "Student Classrooms" for now.
// Actually, the previous page had the student info.
</script>

<template>
  <div class="container mx-auto p-4 md:p-6">
    <div class="mb-4">
      <NuxtLink
        to="/teacher/students_dashboard"
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
        Back to Students
      </NuxtLink>
    </div>

    <h1 class="text-2xl md:text-3xl font-bold mb-6">Student Classrooms</h1>

    <div v-if="pending" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>Error loading classrooms: {{ error.message }}</span>
    </div>

    <div
      v-else-if="classrooms && classrooms.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="classroom in classrooms"
        :key="classroom.id"
        class="card bg-base-100 shadow-xl border border-base-200"
      >
        <div class="card-body">
          <h2 class="card-title">{{ classroom.name }}</h2>
          <p class="text-sm opacity-70">
            {{ classroom.description || "No description" }}
          </p>
          <div class="mt-4">
            <div class="badge badge-outline gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                class="inline-block w-4 h-4 stroke-current"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              Teacher: {{ classroom.teacherName }}
            </div>
          </div>
          <div class="card-actions justify-end mt-4">
            <span class="text-xs opacity-50 mr-auto self-center"
              >Joined:
              {{ new Date(classroom.joinedAt).toLocaleDateString() }}</span
            >
            <NuxtLink
              :to="`/teacher/students_dashboard/${studentId}/${classroom.id}`"
              class="btn btn-primary btn-sm"
            >
              View Performance
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 opacity-50">
      <p>This student is not enrolled in any classrooms.</p>
    </div>
  </div>
</template>
