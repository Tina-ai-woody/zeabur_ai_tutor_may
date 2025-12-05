<script setup lang="ts">
definePageMeta({
  layout: "parent",
});
const localePath = useLocalePath();
const { t } = useI18n();

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
    navigateTo(localePath("/parent/pending"));
  } catch (err: any) {
    error.value = err.data?.statusMessage || t("parent.starter.submit_error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10">
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-4">
          {{ $t("parent.starter.title") }}
        </h2>
        <p class="mb-4 text-gray-600">
          {{ $t("parent.starter.description") }}
        </p>

        <form @submit.prevent="submitRequest" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">{{
                $t("parent.starter.student_name")
              }}</span>
            </label>
            <input
              v-model="studentName"
              type="text"
              :placeholder="$t('parent.starter.student_name_placeholder')"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">{{
                $t("parent.starter.student_email")
              }}</span>
            </label>
            <input
              v-model="studentEmail"
              type="email"
              :placeholder="$t('parent.starter.student_email_placeholder')"
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
              {{ $t("parent.starter.submit") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
