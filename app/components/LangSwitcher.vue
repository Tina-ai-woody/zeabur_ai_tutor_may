<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const onLocaleChanged = async (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newLocale = target.value;
  const path = switchLocalePath(newLocale as any);
  if (path) {
    await navigateTo(path);
  }
};
</script>

<template>
  <select :value="locale" @change="onLocaleChanged" class="select">
    <option disabled selected>Pick a language</option>
    <option v-for="l in locales" :key="l.code" :value="l.code">
      {{ l.name }}
    </option>
  </select>
</template>
