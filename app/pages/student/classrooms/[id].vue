<script setup lang="ts">
definePageMeta({
  layout: "student",
});

const route = useRoute();
const classroomId = route.params.id as string;

// Fetch classroom details
const {
  data: classroom,
  refresh,
  error,
} = await useFetch(`/api/student/classrooms/${classroomId}`);

// Fetch homeworks
const { data: homeworks } = await useFetch(
  `/api/student/classrooms/${classroomId}/homeworks`
);
</script>

<template>
  <div class="container mx-auto p-4 md:p-6">
    <div class="mb-4">
      <NuxtLink to="/student/classrooms" class="btn btn-ghost btn-sm gap-2">
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
        Back to Classrooms
      </NuxtLink>
    </div>

    <div v-if="classroom" class="space-y-8">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 class="text-3xl font-bold">{{ classroom.name }}</h1>
          <p class="text-lg opacity-70 mt-2">{{ classroom.description }}</p>
        </div>
      </div>

      <!-- Students List (Read Only) -->
      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body">
          <h2 class="card-title mb-4">
            Classmates ({{ classroom.students.length }})
          </h2>

          <div v-if="classroom.students.length > 0" class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in classroom.students" :key="student.id">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="avatar placeholder">
                        <div
                          class="bg-neutral text-neutral-content rounded-full w-8"
                        >
                          <span v-if="student.image">
                            <img :src="student.image" />
                          </span>
                          <span v-else>{{
                            student.name.charAt(0).toUpperCase()
                          }}</span>
                        </div>
                      </div>
                      <div class="font-bold">{{ student.name }}</div>
                    </div>
                  </td>
                  <td>{{ new Date(student.joinedAt).toLocaleDateString() }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-10 opacity-50">
            <p>No other students enrolled yet.</p>
          </div>
        </div>
      </div>

      <!-- Homeworks List -->
      <div class="card bg-base-100 shadow-xl border border-base-200">
        <div class="card-body">
          <h2 class="card-title mb-4">Homeworks</h2>

          <div v-if="homeworks && homeworks.length > 0" class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Deadline</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="hw in homeworks" :key="hw.id">
                  <td class="font-bold">{{ hw.title || "Untitled" }}</td>
                  <td>{{ hw.subject || "-" }}</td>
                  <td>
                    <span
                      :class="{
                        'text-error':
                          hw.deadline && new Date(hw.deadline) < new Date(),
                      }"
                    >
                      {{
                        hw.deadline
                          ? new Date(hw.deadline).toLocaleString()
                          : "No deadline"
                      }}
                    </span>
                  </td>
                  <td>{{ new Date(hw.createdAt).toLocaleDateString() }}</td>
                  <td>
                    <NuxtLink
                      :to="`/student/homeworks/${hw.id}`"
                      class="btn btn-sm btn-primary"
                    >
                      View HW
                    </NuxtLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="text-center py-10 opacity-50">
            <p>No homeworks assigned to this classroom yet.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span>Error loading classroom: {{ error.message }}</span>
    </div>

    <div v-else class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>
