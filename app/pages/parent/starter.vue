<script setup lang="ts">
definePageMeta({
  layout: "parent",
});

const studentName = ref("");
const studentEmail = ref("");
const loading = ref(false);
const error = ref("");

const submitRequest = async () => {
  loading.value = true;
  error.value = "";
  try {
    await $fetch("/api/parent/link-request", {
      method: "POST",
      body: {
        studentName: studentName.value,
        studentEmail: studentEmail.value,
      },
    });
    navigateTo("/parent/pending");
  } catch (err: any) {
    error.value = err.data?.statusMessage || "Failed to submit request";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-4">Link Student Account</h2>
        <p class="mb-4 text-gray-600">
          Please provide your child's name and the email address they use for
          this website.
        </p>

        <form @submit.prevent="submitRequest" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Student Name</span>
            </label>
            <input
              v-model="studentName"
              type="text"
              placeholder="e.g. John Doe"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Student Email</span>
            </label>
            <input
              v-model="studentEmail"
              type="email"
              placeholder="e.g. john@example.com"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div v-if="error" class="alert alert-error text-sm">
            {{ error }}
          </div>

          <div class="card-actions justify-end mt-6">
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner"></span>
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
