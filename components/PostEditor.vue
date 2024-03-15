<script lang="ts" setup>
import YouTubeVideoId from "youtube-video-id";
import type { Post } from "@/types";

const props = defineProps({
  post: { type: Object as PropType<Post>, required: true },
});

const postsStore = usePostsStore();
const router = useRouter();
const post = ref({
  title: props.post.title,
  content: props.post.content,
  songURL: props.post.songURL,
});
const errorMessage = ref("");
const isUploading = ref(false);
const isEditorOpen = ref(false);
const isPostSubmitted = ref(false);
const isPostDeleted = ref(false);
const isDeleteClicked = ref(false);
const deleteButtonText = computed(() => {
  return isDeleteClicked.value ? "Confirm Post Deletion" : "Delete Post";
});

const openEditor = () => {
  errorMessage.value = "";
  isEditorOpen.value = true;
};

const submitPost = async () => {
  isUploading.value = true;
  if (!post.value.title) {
    isUploading.value = false;
    errorMessage.value = "Please enter a title.";
    return;
  }

  const youtubeID = YouTubeVideoId(post.value.songURL);
  if (!youtubeID) {
    isUploading.value = false;
    errorMessage.value =
      "Please enter a valid YouTube URL. (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)";
    return;
  }

  if (!post.value.content) {
    isUploading.value = false;
    errorMessage.value = "Please enter some content.";
    return;
  }
  const res = await postsStore.editPost(
    props.post.id,
    post.value.title,
    post.value.content,
    youtubeID
  );
  if (res === "success") {
    isEditorOpen.value = false;
    isPostSubmitted.value = true;
    router.push("/");
  } else {
    errorMessage.value = "Something went wrong. Please try again.";
    console.log(res, errorMessage.value);
  }
  isUploading.value = false;
};

const closeAll = () => {
  isEditorOpen.value = false;
  isPostSubmitted.value = false;
};

const closeAfterDelete = () => {
  router.push("/");
};

const confirmDelete = async () => {
  if (isDeleteClicked.value) {
    const res = await postsStore.deletePostById(props.post.id);
    if (res === "success") {
      isEditorOpen.value = false;
      isPostDeleted.value = true;
    } else {
      errorMessage.value = "Something went wrong. Please try again.";
    }
    isEditorOpen.value = false;
  } else {
    isDeleteClicked.value = true;
  }
};
</script>

<template>
  <UButton label="Edit Post" @click="openEditor" color="blue" />
  <UModal v-model="isEditorOpen">
    <div class="p-4">
      <h1 class="pb-4 text-lg font-bold">Edit Post</h1>
      <UForm :state="post" class="space-y-4" @submit="submitPost">
        <UFormGroup label="Post Title" required>
          <UInput
            v-model="post.title"
            type="text"
            name="noteTitle"
            id="noteTitle"
            placeholder="Enter a title"
            color="blue"
          />
        </UFormGroup>
        <UFormGroup label="Song URL" required>
          <UInput
            v-model="post.songURL"
            type="text"
            name="songURL"
            id="songURL"
            placeholder="Enter a YouTube URL"
            color="blue"
          />
        </UFormGroup>
        <UFormGroup label="Content" required>
          <UTextarea
            v-model="post.content"
            name="noteContent"
            id="noteContent"
            placeholder="Enter some content"
            color="blue"
          />
        </UFormGroup>
        <p class="text-red-500 text-sm">{{ errorMessage }}</p>
        <div class="flex gap-6">
          <UButton
            label="Submit Post"
            type="submit"
            color="blue"
            variant="outline"
            :loading="isUploading"
          />
          <UButton
            label="Cancel"
            color="red"
            variant="outline"
            @click="isEditorOpen = false"
          />

          <UButton
            :label="deleteButtonText"
            color="red"
            class="ml-auto"
            @click="confirmDelete"
          />
        </div>
      </UForm>
    </div>
  </UModal>
  <UModal v-model="isPostSubmitted">
    <div class="p-4">
      <h1 class="pb-4 text-lg font-bold">Post Updated</h1>
      <p>Your post has been updated and is now live.</p>
      <div class="flex justify-between gap-6 mt-4">
        <UButton
          label="View Post"
          color="blue"
          variant="outline"
          @click="$router.push('/')"
        />
      </div>
      <div class="flex justify-end mt-4">
        <UButton
          label="Close"
          color="red"
          variant="outline"
          @click="closeAll"
        />
      </div>
    </div>
  </UModal>
  <UModal v-model="isPostDeleted" @close="$router.push('/')">
    <div class="p-4">
      <h1 class="pb-4 text-lg font-bold">Post Deleted</h1>
      <p>Your post has been deleted.</p>
      <div class="flex justify-between gap-6 mt-4">
        <UButton
          label="Close"
          color="red"
          variant="outline"
          @click="closeAfterDelete"
        />
      </div>
    </div>
  </UModal>
</template>
