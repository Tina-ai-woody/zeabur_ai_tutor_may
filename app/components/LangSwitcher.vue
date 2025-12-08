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
      <Icon name="heroicons-solid:chevron-down" />
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
