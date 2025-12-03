<script setup lang="ts">
definePageMeta({
  layout: "parent",
});

const { data: status, pending } = await useFetch("/api/parent/status");

if (status.value) {
  if (status.value.isPending) {
    navigateTo("/parent/pending");
  } else if (!status.value.isLinked) {
    navigateTo("/parent/starter");
  }
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Parent Dashboard</h1>
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Welcome, Parent!</h2>
        <p>This is your dashboard. More features coming soon.</p>
      </div>
    </div>
  </div>
</template>
