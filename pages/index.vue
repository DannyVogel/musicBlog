<script lang="ts" setup>
import type { Note } from "@/types";

const notesStore = useNotesStore();
const isLoading = ref(true);
const notes = ref();
onMounted(async () => {
  await notesStore.getAllUserNotes();
  getNotes();
  console.log(notesStore.userNotes);
  isLoading.value = false;
});

const getNotes = async () => {
  notes.value = Object.values(notesStore.userNotes).sort((a: Note, b: Note) => {
    return b.timeStamp.seconds - a.timeStamp.seconds;
  });
};
</script>

<template>
  <div class="flex flex-col gap-3 mt-2 text-black" :key="notes[0].id">
    <div class="flex flex-col flex-nowrap overflow-hidden">
      <h1
        class="text-2xl truncate text-cyan-700 font-semibold border-b-slate-500"
      >
        {{ notes[0].title }}
      </h1>
      <p class="text-sm text-gray-400">
        {{
          notes[0].timeStamp.toDate().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        }}
        - {{ notes[0].author }}
      </p>
    </div>
    <VideoPlayer :id="notes[0].songURL" title="YouTube video player" />

    <div class="px-3 flex items-end"></div>
    <p v-html="notes[0].content" class="px-3 pb-24"></p>
  </div>
</template>
