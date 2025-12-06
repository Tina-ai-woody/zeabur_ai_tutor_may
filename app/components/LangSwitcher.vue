<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentLocaleName = computed(() => {
  return (locales.value as any[]).find((l) => l.code === locale.value)?.name;
});
</script>

<template>
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost">
      {{ currentLocaleName }}
      <svg
        width="12px"
        height="12px"
        class="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 2048"
      >
        <path
          d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"
        ></path>
      </svg>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
    >
      <li v-for="l in locales" :key="l.code">
        <NuxtLink :to="switchLocalePath(l.code)">{{ l.name }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
