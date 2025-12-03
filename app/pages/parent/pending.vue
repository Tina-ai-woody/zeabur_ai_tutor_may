<script setup lang="ts">
definePageMeta({
  layout: "parent",
});
</script>

<template>
  <div class="max-w-md mx-auto mt-10 text-center">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="flex justify-center mb-4">
          <div class="p-4 bg-blue-100 rounded-full text-blue-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12"
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
        </div>
        <h2 class="card-title text-2xl justify-center mb-2">Request Pending</h2>
        <p class="text-gray-600">
          Your request to link with a student account has been submitted and is
          waiting for admin confirmation.
        </p>
        <p class="text-sm text-gray-500 mt-4">
          You will be notified once your request is approved.
        </p>
      </div>
    </div>
  </div>
</template>
