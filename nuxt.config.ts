// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@formkit/auto-animate",
    "@nuxtjs/google-fonts",
  ],
  build: {
    transpile: ["pinia-plugin-persistedstate"],
  },
  googleFonts: {
    families: {
      Satisfy: true,
    },
  },
  ui: {
    icons: ["fluent"],
  },
  runtimeConfig: {
    public: {
      apiKey: "",
      authDomain: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: "",
      appId: "",
    },
  },
  typescript: {
    strict: true,
  },
});
