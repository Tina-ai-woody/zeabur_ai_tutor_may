<script setup lang="ts">
definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="bg-base-200 min-h-screen">
    <!-- Mission Section -->
    <div class="hero bg-base-100 py-20">
      <div class="hero-content text-center">
        <div class="max-w-2xl">
          <h1 class="text-5xl font-bold mb-8">
            {{ $t("about.mission.title") }}
          </h1>
          <p class="text-xl mb-6">
            {{ $t("about.mission.description_1") }}
          </p>
          <p class="text-xl">
            {{ $t("about.mission.description_2") }}
          </p>
        </div>
      </div>
    </div>

    <!-- Team Section -->
    <div class="container mx-auto px-4 py-20">
      <h2 class="text-4xl font-bold text-center mb-16">
        {{ $t("about.team.title") }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Team Member 1 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">CW</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Chun-Wei, Hsu</h2>
            <p class="text-sm uppercase tracking-wide">
              {{ $t("about.team.chun_wei.title") }}
            </p>
            <p class="mt-4">
              {{ $t("about.team.chun_wei.description") }}
            </p>
          </div>
        </div>

        <!-- Team Member 2 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">TC</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Tina Chong</h2>
            <p class="text-sm uppercase tracking-wide">
              {{ $t("about.team.tina.title") }}
            </p>
            <p class="mt-4">
              {{ $t("about.team.tina.description") }}
            </p>
          </div>
        </div>

        <!-- Team Member 3 -->
        <div class="card bg-base-100 shadow-xl">
          <figure class="px-10 pt-10">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content rounded-full w-24">
                <span class="text-3xl">FY</span>
              </div>
            </div>
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title">Fang-Yu, Hsu</h2>
            <p class="text-sm uppercase tracking-wide">
              {{ $t("about.team.fang_yu.title") }}
            </p>
            <p class="mt-4">
              {{ $t("about.team.fang_yu.description") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
