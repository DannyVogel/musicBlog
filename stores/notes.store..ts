import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  db,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from "@/config/firebase";
import type { Note, Comment } from "@/types";
// import { getYouTubeEmbedUrl, findNoteById, findNoteKeyById } from "@/utils";
// import useAuthStore from "@/stores/authStore";

export const useNotesStore = defineStore("notes", {
  state: () => ({
    userNotes: {} as Record<string, Note>,
    allUsersNotes: {} as Record<string, Note>,
  }),
  getters: {
    getAllUserNotesAsArray: (state) => Object.values(state.userNotes),
    getAllUsersNotesSortedByTimestamp: (state) => {
      return Object.values(state.allUsersNotes).sort((a: Note, b: Note) => {
        return b.timeStamp.seconds - a.timeStamp.seconds;
      });
    },
  },
  actions: {
    async uploadNote(
      userName: string,
      title: string,
      content: string,
      songURL: string,
      userUID: string,
      likedBy?: string[],
      comments?: object[]
    ) {
      const id = uuidv4();
      const docData = {
        id: id,
        author: userName,
        timeStamp: serverTimestamp(),
        title: title,
        content: content,
        songURL: songURL,
        likedBy: [],
        comments: [],
      };
      try {
        await addDoc(collection(db, "users", userUID, "userNotes"), docData);
        return "success";
      } catch (error) {
        console.error("Error writing document: ", error);
        return "error";
      }
    },
    async getAllUserNotes() {
      try {
        const querySnapshot = await getDocs(
          query(
            collection(
              db,
              "users",
              "SLshmJdXrvfTyACar6MGhWLetjX2",
              "userNotes"
            ),
            orderBy("timeStamp", "desc")
          )
        );
        this.userNotes = {};
        querySnapshot.forEach((doc) => {
          this.userNotes[doc.id] = doc.data() as Note; // Set the data to the userNotes object
        });
      } catch (error) {
        console.error("Error fetching user notes:", error);
      }
    },
  },
});
