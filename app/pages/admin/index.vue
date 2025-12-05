<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

const localePath = useLocalePath();
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">{{ $t("admin.dashboard.title") }}</h1>
    <p>{{ $t("admin.dashboard.welcome") }}</p>
  </div>
</template>
