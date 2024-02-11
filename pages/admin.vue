<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="mt-4">
    <AuthAccess v-if="!authStore.isLoggedIn" />
    <div v-else>
      <PostCreator />
      <AuthLogOut />
    </div>
  </div>
</template>
