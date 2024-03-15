<script lang="ts" setup>
const route = useRoute();
const authStore = useAuthStore();
const postsStore = usePostsStore();
const post = computed(() => postsStore.getPostById(route.params.id as string));

onMounted(async () => {
  await postsStore.getPosts();
});
</script>

<template>
  <div class="my-2 flex justify-between">
    <NuxtLink
      v-if="authStore.isLoggedIn && post"
      to="/"
      class="text-black py-1 hover:text-cyan-700"
      >< Back</NuxtLink
    >
    <PostEditor v-if="authStore.isLoggedIn && post" :post="post" />
  </div>
  <div
    v-if="post"
    class="flex flex-col gap-3 mt-2 text-black border border-slate-300 p-5 rounded"
  >
    <section class="flex flex-col overflow-hidden">
      <div
        class="flex items-baseline justify-between border border-b-slate-300"
      >
        <h1 class="text-2xl text-cyan-700 font-semibold sm:truncate">
          {{ post.title }}
        </h1>
        <div class="hidden sm:flex gap-1 items-center">
          <UIcon
            name="i-fluent-heart-16-filled"
            class="bg-cyan-700 cursor-pointer"
            @click="postsStore.likePostById(post.id)"
          />
          <p class="text-slate-400">{{ post.likedBy?.length }}</p>
          <UIcon name="i-fluent-heart-broken-16-regular" class="bg-cyan-700" />
          <p class="text-slate-400">0</p>
        </div>
      </div>
      <div class="sm:hidden ml-auto flex gap-1 items-center">
        <UIcon name="i-fluent-heart-16-filled" class="bg-cyan-700" />
        <p class="text-slate-400">{{ post.likedBy?.length }}</p>
        <UIcon name="i-fluent-heart-broken-16-regular" class="bg-cyan-700" />
        <p class="text-slate-400">0</p>
      </div>
      <p class="pl-0.5 text-sm text-gray-400">
        {{
          post.timeStamp.toDate().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        }}
        - {{ post.author }}
      </p>
    </section>
    <VideoPlayer :id="post.songURL" title="YouTube video player" />

    <p v-html="post.content"></p>
    <Comments :comments="post.comments" :post-id="post.id" />
  </div>
</template>
