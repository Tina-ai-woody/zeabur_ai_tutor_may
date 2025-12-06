<script setup lang="ts">
import { useSession } from "../../lib/auth-client";

const session = useSession();
const localePath = useLocalePath();
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center">
    <div class="card w-full max-w-2xl bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl mb-4">
          {{ $t("login_success.title") }}
        </h2>

        <div v-if="session.data" class="space-y-4">
          <div class="alert alert-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ $t("login_success.success_message") }}</span>
          </div>

          <div class="stats shadow w-full">
            <div class="stat">
              <div class="stat-title">{{ $t("login_success.role") }}</div>
              <div class="stat-value text-primary">
                {{ session.data.user.role || "No Role" }}
              </div>
              <div class="stat-desc">{{ $t("login_success.role_desc") }}</div>
            </div>
          </div>

          <div class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title text-xl font-medium">
              {{ $t("login_success.user_details") }}
            </div>
            <div class="collapse-content">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div>
                  <label class="label">
                    <span class="label-text font-bold">{{
                      $t("login_success.name")
                    }}</span>
                  </label>
                  <div class="p-3 bg-base-100 rounded-lg">
                    {{ session.data.user.name }}
                  </div>
                </div>
                <div>
                  <label class="label">
                    <span class="label-text font-bold">{{
                      $t("login_success.email")
                    }}</span>
                  </label>
                  <div class="p-3 bg-base-100 rounded-lg">
                    {{ session.data.user.email }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <label class="label">
                    <span class="label-text font-bold">{{
                      $t("login_success.user_id")
                    }}</span>
                  </label>
                  <div class="p-3 bg-base-100 rounded-lg font-mono text-sm">
                    {{ session.data.user.id }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title text-xl font-medium">
              {{ $t("login_success.full_session") }}
            </div>
            <div class="collapse-content">
              <div class="mockup-code mt-4">
                <pre><code>{{ JSON.stringify(session.data, null, 2) }}</code></pre>
              </div>
            </div>
          </div>

          <div class="card-actions justify-end mt-6">
            <NuxtLink
              v-if="session.data.user.role === 'admin'"
              :to="localePath('/admin')"
              class="btn btn-primary"
              >{{ $t("login_success.go_to_admin") }}</NuxtLink
            >
            <NuxtLink
              v-if="session.data.user.role === 'teacher'"
              :to="localePath('/teacher')"
              class="btn btn-primary"
              >{{ $t("login_success.go_to_teacher") }}</NuxtLink
            >
            <NuxtLink
              v-if="session.data.user.role === 'student'"
              :to="localePath('/student')"
              class="btn btn-primary"
              >{{ $t("login_success.go_to_student") }}</NuxtLink
            >
            <NuxtLink
              v-if="session.data.user.role === 'parent'"
              :to="localePath('/parent')"
              class="btn btn-primary"
              >{{ $t("login_success.go_to_parent") }}</NuxtLink
            >
          </div>
        </div>

        <div v-else class="flex justify-center py-8">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    </div>
  </div>
</template>
