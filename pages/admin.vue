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
      <h1 class="text-2xl text-cyan-700 text-center">
        Welcome {{ authStore.userName }}
      </h1>
      <div class="text-black">
        <p>
          Total Posts: {{ isLoading ? "Loading..." : postsStore.getPostsCount }}
        </p>
        <p>
          Total Likes: {{ isLoading ? "Loading..." : postsStore.getTotalLikes }}
        </p>
      </div>
      <PostCreator />
      <AuthLogOut />
    </div>
  </div>
</template>
