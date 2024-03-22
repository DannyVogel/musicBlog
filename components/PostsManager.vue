<script lang="ts" setup>
const postsStore = usePostsStore();
const posts = computed(() => {
  return Object.entries(postsStore.posts).map(([id, post]) => ({
    ...post,
    timeStamp: post.timeStamp.toDate().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    likedBy: post.likedBy.length,
    dislikedBy: post.dislikedBy.length,
    comments: post.comments.length,
  }));
});

const columns = [
  { key: "title", label: "Title" },
  { key: "timeStamp", label: "Date", sortable: true },
  { key: "likedBy", label: "Likes", sortable: true },
  { key: "dislikedBy", label: "Dislikes", sortable: true },
  { key: "comments", label: "Comments", sortable: true },
];

const page = ref(1);
const pageCount = 5;

const query = ref("");

const filteredRows = computed(() => {
  if (!query.value) {
    return posts.value.slice(
      (page.value - 1) * pageCount,
      page.value * pageCount
    );
  }

  return posts.value.filter((post) => {
    return Object.values(post).some((value) => {
      return String(value).toLowerCase().includes(query.value.toLowerCase());
    });
  });
});
</script>

<template>
  <UCard class="w-full min-h-[500px]">
    <template #header>
      <h2 class="text-xl text-white">Posts Manager</h2>
    </template>
    <div
      class="flex items-center justify-between py-3.5 border-b border-gray-200 dark:border-gray-700 -mt-5"
    >
      <UInput v-model="query" placeholder="Search posts..." color="cyan" />
      <div class="text-gray-400 text-sm flex gap-4">
        <p>
          Posts:
          {{ postsStore.isLoading ? "Loading..." : postsStore.getPostsCount }}
        </p>
        <p>
          Likes:
          {{ postsStore.isLoading ? "Loading..." : postsStore.getTotalLikes }}
        </p>
        <p>
          Dislikes:
          {{
            postsStore.isLoading ? "Loading..." : postsStore.getTotalDislikes
          }}
        </p>
        <p>
          Comments:
          {{
            postsStore.isLoading ? "Loading..." : postsStore.getCommentsCount
          }}
        </p>
      </div>
    </div>
    <UTable
      :loading="postsStore.isLoading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      :rows="filteredRows"
      :columns="columns"
      class="w-full"
    >
      <template #title-data="{ row }">
        <NuxtLink :to="'/posts/' + row.id">
          <p class="w-[200px] truncate hover:text-cyan-700">
            {{ row.title }}
          </p>
        </NuxtLink>
      </template>
      <template #timeStamp-data="{ row }">
        <p class="w-[80px]">{{ row.timeStamp }}</p>
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <UPagination
        v-if="!query"
        v-model="page"
        :page-count="pageCount"
        :total="posts.length"
      />
    </div>
  </UCard>
</template>
