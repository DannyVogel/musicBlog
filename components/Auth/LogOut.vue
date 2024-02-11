<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <UButton color="red" label="Sign Out" @click="authStore.logOut" />
</template>
