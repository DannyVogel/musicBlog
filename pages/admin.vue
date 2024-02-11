<script lang="ts" setup>
const authStore = useAuthStore();

const postsStore = usePostsStore();
onMounted(async () => {
  await postsStore.getPosts();
});
</script>

<template>
  <div class="mt-4">
    <AuthAccess v-if="!authStore.isLoggedIn" />
    <div v-else class="flex flex-col items-center gap-8">
      <h1 class="text-2xl text-cyan-700 text-center">
        Welcome {{ authStore.userName }}
      </h1>
      <div class="text-black">
        <p>Total Posts: {{ postsStore.getPostsCount }}</p>
        <p>Total Likes: {{ postsStore.getTotalLikes }}</p>
      </div>
      <PostCreator />
      <AuthLogOut />
    </div>
  </div>
</template>
