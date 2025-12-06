<script setup lang="ts">
import { authClient } from "../../lib/auth-client";
const localePath = useLocalePath();

// definePageMeta({
//   layout: "default",
// });

const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        navigateTo(localePath("/"));
      },
    },
  });
};

onMounted(async () => {
  try {
    await $fetch("/api/admin/notify-new-user", {
      method: "POST",
    });
  } catch (error) {
    console.error("Failed to send notification email", error);
  }
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title text-2xl font-bold mb-2">
          {{ $t("pending.title") }}
        </h2>
        <div class="py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 text-warning mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p class="text-base-content/70 mb-6">
          {{ $t("pending.description") }}
        </p>
        <div class="card-actions">
          <button @click="handleLogout" class="btn btn-primary">
            {{ $t("pending.logout") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
