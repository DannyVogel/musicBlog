<script setup lang="ts">
import type { Comment } from "~/types";

const postsStore = usePostsStore();

const props = defineProps({
  comments: {
    type: Array as PropType<Comment[]>,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
});
const items = [
  {
    label: `${props.comments.length} comments`,
    slot: "comments",
    description: "Comments on the post",
  },
];

const comment = ref({
  author: "",
  comment: "",
});
const errorMessage = ref("");

const submitComment = () => {
  if (comment.value.author == "") {
    errorMessage.value = "You need to provide a name!";
    return;
  }
  if (comment.value.comment == "") {
    errorMessage.value = "You can't post an empty comment!";
    return;
  }
  postsStore.addComment(props.postId, {
    author: comment.value.author,
    comment: comment.value.comment,
    postedAt: new Date(),
  });
  errorMessage.value = "Comment posted!";
  setTimeout(() => {
    errorMessage.value = "";
  }, 3000);
  comment.value.author = "";
  comment.value.comment = "";
};
</script>

<template>
  <UAccordion :items="items" color="blue" variant="link">
    <template #default="{ item, index, open }">
      <p
        class="text-center text-cyan-700 font-semibold cursor-pointer hover:underline border"
      >
        {{ item.label }}
      </p>
    </template>
    <template #comments>
      <h1 class="text-lg font-bold text-black">Comments</h1>
      <div
        v-for="(comment, index) in comments"
        :key="index"
        class="p-4 border border-slate-300 rounded my-2 text-black"
      >
        <div class="flex justify-between">
          <p
            class="font-bold"
            :class="comment.author === 'Alex_dlc' && 'text-cyan-700'"
          >
            {{ comment.author }}
          </p>
          <p class="text-xs text-slate-400 italic">
            {{ getFormattedDate(comment.postedAt) }}
          </p>
        </div>
        <p>{{ comment.comment }}</p>
      </div>
      <h1 class="text-lg font-bold text-black">Leave a comment</h1>
      <UForm :state="comment" class="space-y-4" @submit="submitComment">
        <UFormGroup
          label="Your Name"
          required
          :ui="{ label: { base: 'text-black dark:text-black' } }"
        >
          <UInput
            v-model="comment.author"
            type="text"
            name="author"
            id="author"
            placeholder="Enter your name"
            color="blue"
            :ui="{ variant: { outline: 'text-black dark:text-black' } }"
          />
        </UFormGroup>
        <UFormGroup
          label="Your Comment"
          required
          :ui="{ label: { base: 'text-black dark:text-black' } }"
        >
          <UTextarea
            v-model="comment.comment"
            name="comment"
            id="comment"
            placeholder="Enter your comment"
            color="blue"
            :ui="{ variant: { outline: 'text-black dark:text-black' } }"
          />
        </UFormGroup>
        <UButton
          label="Submit Comment"
          type="submit"
          color="blue"
          variant="outline"
        />
        <p class="text-red-500">{{ errorMessage }}</p>
      </UForm>
    </template>
  </UAccordion>
</template>
