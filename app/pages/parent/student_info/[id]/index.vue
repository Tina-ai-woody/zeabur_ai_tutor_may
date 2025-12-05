<script setup lang="ts">
definePageMeta({
  layout: "parent",
});
const localePath = useLocalePath();

const route = useRoute();
const studentId = route.params.id as string;

// Fetch student's classrooms
const {
  data: classrooms,
  pending,
  error,
} = await useFetch(`/api/parent/students/${studentId}/classrooms`);
</script>

<template>
  <div class="container mx-auto p-4 md:p-6">
    <div class="mb-4">
      <NuxtLink
        :to="localePath('/parent/student_info')"
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
        {{ $t("parent.student_info.back_to_students") }}
      </NuxtLink>
    </div>

    <h1 class="text-2xl md:text-3xl font-bold mb-6">
      {{ $t("parent.student_info.student_classrooms") }}
    </h1>

    <div v-if="pending" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <span
        >{{ $t("parent.student_info.error_loading_classrooms") }}
        {{ error.message }}</span
      >
    </div>

    <div v-else-if="classrooms && classrooms.length > 0">
      <StudentClassroomsList
        :classrooms="classrooms"
        :base-link="localePath(`/parent/student_info/${studentId}`)"
      />
    </div>

    <div v-else class="text-center py-10 opacity-50">
      <p>{{ $t("parent.student_info.no_classrooms") }}</p>
    </div>
  </div>
</template>
