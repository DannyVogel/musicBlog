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
  deleteDoc,
} from "@/config/firebase";
import type { Post, Comment } from "@/types";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: {} as Record<string, Post>,
  }),
  getters: {
    getPostById: (state) => (id: string) => {
      return Object.values(state.posts).find((post) => post.id === id);
    },
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
    async editPost(
      postId: string,
      title: string,
      content: string,
      songURL: string
    ) {
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].title = title;
        this.posts[key].content = content;
        this.posts[key].songURL = getYouTubeEmbedUrl(songURL) || post.songURL;
        await updateDoc(
          doc(db, "users", "SLshmJdXrvfTyACar6MGhWLetjX2", "userNotes", key),
          this.posts[key]
        );
        return "success";
      } catch (error) {
        console.error("Error updating document: ", error);
        return "error";
      }
    },
    async deletePostById(postId: string) {
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        await deleteDoc(
          doc(db, "users", "SLshmJdXrvfTyACar6MGhWLetjX2", "userNotes", key)
        );
        return "success";
      } catch (error) {
        console.error("Error deleting document: ", error);
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
          this.posts[doc.id] = doc.data() as Post;
        });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    },
    async likePostById(postId: string) {
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].likedBy?.push(uuidv4());
        await updateDoc(
          doc(db, "users", "SLshmJdXrvfTyACar6MGhWLetjX2", "userNotes", key),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding like to post:", error);
      }
    },
    async dislikePostById(postId: string) {
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].dislikedBy?.push(uuidv4());
        await updateDoc(
          doc(db, "users", "SLshmJdXrvfTyACar6MGhWLetjX2", "userNotes", key),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error removing like from post:", error);
      }
    },
    async addComment(postId: string, comment: Comment) {
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].comments?.push(comment);
        await updateDoc(
          doc(db, "users", "SLshmJdXrvfTyACar6MGhWLetjX2", "userNotes", key),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding comment to post:", error);
      }
    },
  },
  persist: true,
});
