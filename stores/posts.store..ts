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
import type { Post, Comment } from "@/types";
// import { getYouTubeEmbedUrl, findNoteById, findNoteKeyById } from "@/utils";
// import useAuthStore from "@/stores/authStore";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: {} as Record<string, Post>,
  }),
  getters: {
    getSortedPostsAsArray: (state) =>
      Object.values(state.posts).sort((a: Post, b: Post) => {
        return b.timeStamp.seconds - a.timeStamp.seconds;
      }),
    getPostsCount: (state) => Object.keys(state.posts).length,
    getTotalLikes: (state) => {
      let totalLikes = 0;
      for (const key in state.posts) {
        totalLikes += state.posts[key].likedBy.length;
      }
      return totalLikes;
    },
  },
  actions: {
    async uploadPost(
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
    async getPosts() {
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
        this.posts = {};
        querySnapshot.forEach((doc) => {
          this.posts[doc.id] = doc.data() as Post; // Set the data to the userposts object
        });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },
  },
  persist: true,
});
