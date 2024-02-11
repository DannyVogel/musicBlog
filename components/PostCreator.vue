<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <h1 class="text-2xl text-cyan-700 text-center">
    Welcome {{ authStore.userName }}
  </h1>
</template>
