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
import { getYouTubeEmbedUrl, findPostById, findPostKeyById } from "@/utils";
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
          this.posts[doc.id] = doc.data() as Post; // Set the data to the posts object
        });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },
    async likePostById(postId: string) {
      const authStore = useAuthStore();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].likedBy?.push(uuidv4());
        // Update the post in the database
        await updateDoc(
          doc(db, "users", authStore.userUID, "userNotes", key),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding like to post:", error);
      }
    },
    async addComment(postId: string, comment: Comment) {
      const authStore = useAuthStore();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].comments?.push(comment);
        // Update the post in the database
        await updateDoc(
          doc(db, "users", authStore.userUID, "userNotes", key),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding comment to post:", error);
      }
    },
  },
  persist: true,
});
