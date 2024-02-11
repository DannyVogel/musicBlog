<script lang="ts" setup>
import YouTubeVideoId from "youtube-video-id";

const authStore = useAuthStore();
const PostsStore = usePostsStore();
const post = ref({
  title: "",
  content: "",
  songURL: "",
});
const errorMessage = ref("");
const isUploading = ref(false);
const isCreatorOpen = ref(false);
const isPostSubmitted = ref(false);

const openCreator = () => {
  post.value.title = "";
  post.value.content = "";
  post.value.songURL = "";
  errorMessage.value = "";
  isCreatorOpen.value = true;
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
  const res = await PostsStore.uploadPost(
    authStore.userName,
    post.value.title,
    post.value.content,
    youtubeID,
    authStore.userUID
  );
  if (res === "success") {
    isCreatorOpen.value = false;
    isPostSubmitted.value = true;
  } else {
    errorMessage.value = "Something went wrong. Please try again.";
  }
  isUploading.value = false;
};

const createNewPost = () => {
  post.value.title = "";
  post.value.content = "";
  post.value.songURL = "";
  isPostSubmitted.value = false;
  isCreatorOpen.value = true;
};

const closeAll = () => {
  isCreatorOpen.value = false;
  isPostSubmitted.value = false;
};
</script>

<template>
  <UButton label="Create New Post" @click="openCreator" color="blue" />
  <UModal v-model="isCreatorOpen">
    <div class="p-4">
      <h1 class="pb-4 text-lg font-bold">Create New Post</h1>
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
            @click="isCreatorOpen = false"
          />
        </div>
      </UForm>
    </div>
  </UModal>
  <UModal v-model="isPostSubmitted">
    <div class="p-4">
      <h1 class="pb-4 text-lg font-bold">Post Submitted</h1>
      <p>Your post has been submitted and is now live.</p>
      <div class="flex justify-between gap-6 mt-4">
        <UButton
          label="View Post"
          color="blue"
          variant="outline"
          @click="$router.push('/')"
        />
        <UButton
          label="Create Another Post"
          color="blue"
          variant="outline"
          @click="createNewPost"
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
</template>
