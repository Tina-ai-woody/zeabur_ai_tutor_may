// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.BETTER_AUTH_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  css: ["~/assets/css/main.css"],
});
