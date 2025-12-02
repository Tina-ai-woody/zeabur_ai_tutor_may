<script setup lang="ts">
definePageMeta({
  layout: "student",
});

const { data: classrooms, refresh } = await useFetch("/api/student/classrooms");
</script>

<template>
  <div class="container mx-auto p-4 md:p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl md:text-3xl font-bold">My Classrooms</h1>
    </div>

    <!-- Classroom List -->
    <div
      v-if="classrooms && classrooms.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="classroom in classrooms"
        :key="classroom.id"
        class="card bg-base-100 shadow-xl border border-base-200 hover:border-primary transition-colors cursor-pointer"
      >
        <div class="card-body">
          <h2 class="card-title">{{ classroom.name }}</h2>
          <p class="text-sm opacity-70 line-clamp-2">
            {{ classroom.description || "No description provided." }}
          </p>
          <div class="card-actions justify-end mt-4">
            <NuxtLink
              :to="`/student/classrooms/${classroom.id}`"
              class="btn btn-sm btn-ghost"
              >View Details</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 opacity-50">
      <div class="text-6xl mb-4">🏫</div>
      <h3 class="text-xl font-bold">No classrooms yet</h3>
      <p>You are not enrolled in any classrooms.</p>
    </div>
  </div>
</template>
