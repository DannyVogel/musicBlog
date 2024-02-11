<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <UButton
    color="red"
    label="Sign Out"
    variant="outline"
    @click="authStore.logOut"
  />
</template>
