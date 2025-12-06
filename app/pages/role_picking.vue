<script setup lang="ts">
import { authClient } from "../../lib/auth-client";

const localePath = useLocalePath();

const selectedRole = ref<"teacher" | "student" | "parent" | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  if (!selectedRole.value) return;

  isLoading.value = true;
  error.value = null;

  try {
    await $fetch("/api/user/role-request", {
      method: "POST",
      body: { role: selectedRole.value },
    });
    navigateTo(localePath("/pending"));
  } catch (e: any) {
    console.error("Failed to submit role request", e);
    error.value = e.statusMessage || "Failed to submit role request";
  } finally {
    isLoading.value = false;
  }
};

const handleLogout = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        navigateTo(localePath("/"));
      },
    },
  });
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl font-bold mb-6 justify-center">
          {{ $t("role_picking.title") }}
        </h2>
        <p class="text-center text-base-content/70 mb-6">
          {{ $t("role_picking.description") }}
        </p>

        <div class="form-control gap-4">
          <label
            class="label cursor-pointer border rounded-lg p-4 hover:bg-base-200 transition-colors"
            :class="{
              'border-primary bg-primary/10': selectedRole === 'teacher',
            }"
          >
            <span class="label-text font-medium">{{
              $t("role_picking.teacher")
            }}</span>
            <input
              type="radio"
              name="role"
              class="radio radio-primary"
              value="teacher"
              v-model="selectedRole"
            />
          </label>

          <label
            class="label cursor-pointer border rounded-lg p-4 hover:bg-base-200 transition-colors"
            :class="{
              'border-primary bg-primary/10': selectedRole === 'student',
            }"
          >
            <span class="label-text font-medium">{{
              $t("role_picking.student")
            }}</span>
            <input
              type="radio"
              name="role"
              class="radio radio-primary"
              value="student"
              v-model="selectedRole"
            />
          </label>

          <label
            class="label cursor-pointer border rounded-lg p-4 hover:bg-base-200 transition-colors"
            :class="{
              'border-primary bg-primary/10': selectedRole === 'parent',
            }"
          >
            <span class="label-text font-medium">{{
              $t("role_picking.parent")
            }}</span>
            <input
              type="radio"
              name="role"
              class="radio radio-primary"
              value="parent"
              v-model="selectedRole"
            />
          </label>
        </div>

        <div v-if="error" class="alert alert-error mt-4">
          <span>{{ error }}</span>
        </div>

        <div class="card-actions justify-end mt-6 flex-col gap-2">
          <button
            class="btn btn-primary w-full"
            :disabled="!selectedRole || isLoading"
            @click="handleSubmit"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            {{ $t("role_picking.submit") }}
          </button>
          <button class="btn btn-ghost w-full" @click="handleLogout">
            {{ $t("role_picking.logout") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
