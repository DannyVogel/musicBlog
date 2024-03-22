<script lang="ts" setup>
const authStore = useAuthStore();
const postsStore = usePostsStore();
const isLoading = ref(true);

onMounted(async () => {
  await postsStore.getPosts();
  isLoading.value = false;
});
</script>

<template>
  <div class="mt-4">
    <AuthAccess v-if="!authStore.isLoggedIn" />
    <div v-else class="flex flex-col items-center gap-8">
      <h1 class="text-2xl text-cyan-700 text-center font-bold">
        Welcome {{ authStore.userName }}
      </h1>
      <PostCreator />
      <PostsManager />
      <AuthLogOut class="ml-auto" />
    </div>
  </div>
</template>
