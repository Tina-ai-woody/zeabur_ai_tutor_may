<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold text-error">
          {{ $t("unauthorized.title") }}
        </h1>
        <p class="py-6">
          {{ $t("unauthorized.description") }}
        </p>
        <NuxtLink :to="localePath('/')" class="btn btn-primary">{{
          $t("unauthorized.go_home")
        }}</NuxtLink>
      </div>
    </div>
  </div>
</template>
