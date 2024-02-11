<script lang="ts" setup>
import type { Post } from "@/types";

const postsStore = usePostsStore();
const isLoading = ref(true);
const posts = ref();
onMounted(async () => {
  await postsStore.getPosts();
  getposts();
  console.log(postsStore.posts);
  isLoading.value = false;
});

const getposts = async () => {
  posts.value = Object.values(postsStore.posts).sort((a: Post, b: Post) => {
    return b.timeStamp.seconds - a.timeStamp.seconds;
  });
};
</script>

<template>
  <div
    v-if="!isLoading"
    v-for="post in posts"
    class="flex flex-col gap-3 mt-2 text-black border border-slate-300 p-5 rounded"
  >
    <div class="flex flex-col overflow-hidden">
      <div
        class="flex items-baseline justify-between border border-b-slate-300"
      >
        <h1 class="text-2xl text-cyan-700 font-semibold sm:truncate">
          {{ post.title }}
        </h1>
        <div class="hidden sm:flex gap-1 items-center">
          <UIcon name="i-fluent-heart-16-filled" class="bg-cyan-700" />
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
    </div>
    <VideoPlayer :id="post.songURL" title="YouTube video player" />

    <p v-html="post.content"></p>
  </div>
</template>
