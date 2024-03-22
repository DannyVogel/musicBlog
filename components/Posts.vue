<script lang="ts" setup>
import type { Post } from "@/types";

const postsStore = usePostsStore();
const isLoading = ref(true);
const posts = ref();

const getposts = async () => {
  posts.value = Object.values(postsStore.posts).sort((a: Post, b: Post) => {
    return b.timeStamp.seconds - a.timeStamp.seconds;
  });
};

const title = ref("");
function toCamelCase(str: string) {
  return str
    .replace(/\s(.)/g, function ($1) {
      return $1.toLowerCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function ($1) {
      return $1.toLowerCase();
    });
}

onMounted(async () => {
  await postsStore.getPosts();
  getposts();
  title.value = posts.value[5].title;
  isLoading.value = false;
});
</script>

<template>
  <div
    v-if="!isLoading"
    v-for="post in posts"
    class="flex flex-col gap-3 mt-2 text-black border border-slate-300 p-5 rounded bg-white bg-opacity-60"
  >
    <section
      :id="toCamelCase(post.title)"
      class="flex flex-col overflow-hidden"
    >
      <div
        class="flex items-baseline justify-between border border-b-slate-300"
      >
        <NuxtLink
          :to="'/posts/' + post.id"
          class="text-2xl text-cyan-700 font-semibold sm:truncate"
        >
          {{ post.title }}
        </NuxtLink>
        <div class="hidden sm:flex gap-1 items-center">
          <img
            src="~/assets/icons/fullheart.png"
            alt="like"
            class="w-4 h-4 cursor-pointer"
            @click="postsStore.likePostById(post.id)"
          />
          <p class="text-slate-400">{{ post.likedBy?.length }}</p>
          <img
            src="~/assets/icons/brokenheart.png"
            alt="like"
            class="w-4 h-4 cursor-pointer"
            @click="postsStore.dislikePostById(post.id)"
          />
          <p class="text-slate-400">{{ post.dislikedBy?.length }}</p>
        </div>
      </div>
      <div class="sm:hidden ml-auto flex gap-1 items-center">
        <img
          src="~/assets/icons/fullheart.png"
          alt="like"
          class="w-4 h-4 cursor-pointer"
          @click="postsStore.likePostById(post.id)"
        />
        <p class="text-slate-400">{{ post.likedBy?.length }}</p>
        <img
          src="~/assets/icons/brokenheart.png"
          alt="like"
          class="w-4 h-4 cursor-pointer"
          @click="postsStore.dislikePostById(post.id)"
        />
        <p class="text-slate-400">{{ post.dislikedBy?.length }}</p>
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
