import { v4 as uuidv4 } from "uuid";
import type { Post, Comment } from "@/types";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: {} as Record<string, Post>,
    isLoading: false,
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
        totalLikes += (state.posts[key].likedBy || []).length;
      }
      return totalLikes;
    },
    getTotalDislikes: (state) => {
      let totalDislikes = 0;
      // for (const key in state.posts) {
      //   totalDislikes += (state.posts[key].dislikedBy || []).length;
      // }
      return totalDislikes;
    },
    getCommentsCount: (state) => {
      let totalComments = 0;
      for (const key in state.posts) {
        totalComments += (state.posts[key].comments || []).length;
      }
      return totalComments;
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
      dislikedBy?: string[],
      comments?: object[]
    ) {
      const { $firebase } = useNuxtApp();
      const id = uuidv4();
      const docData = {
        id: id,
        author: userName,
        timeStamp: $firebase.serverTimestamp(),
        title: title,
        content: content,
        songURL: songURL,
        likedBy: [],
        comments: [],
      };
      try {
        await $firebase.addDoc(
          $firebase.collection($firebase.db, "users", userUID, "userNotes"),
          docData
        );
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
      const { $firebase } = useNuxtApp();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].title = title;
        this.posts[key].content = content;
        this.posts[key].songURL = getYouTubeEmbedUrl(songURL) || post.songURL;
        await $firebase.updateDoc(
          $firebase.doc(
            $firebase.db,
            "users",
            "SLshmJdXrvfTyACar6MGhWLetjX2",
            "userNotes",
            key
          ),
          this.posts[key]
        );
        return "success";
      } catch (error) {
        console.error("Error updating document: ", error);
        return "error";
      }
    },
    async deletePostById(postId: string) {
      const { $firebase } = useNuxtApp();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        await $firebase.deleteDoc(
          $firebase.doc(
            $firebase.db,
            "users",
            "SLshmJdXrvfTyACar6MGhWLetjX2",
            "userNotes",
            key
          )
        );
        return "success";
      } catch (error) {
        console.error("Error deleting document: ", error);
        return "error";
      }
    },
    async getPosts() {
      const { $firebase } = useNuxtApp();
      this.isLoading = true;
      try {
        const querySnapshot = await $firebase.getDocs(
          $firebase.query(
            $firebase.collection(
              $firebase.db,
              "users",
              "SLshmJdXrvfTyACar6MGhWLetjX2",
              "userNotes"
            ),
            $firebase.orderBy("timeStamp", "desc")
          )
        );
        this.posts = {};
        querySnapshot.forEach((doc) => {
          const postData = doc.data() as Post;
          this.posts[doc.id] = {
            ...postData,
            likedBy: postData.likedBy || [],
            dislikedBy: postData.dislikedBy || [],
            comments: postData.comments || [],
          };
        });
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async likePostById(postId: string) {
      const { $firebase } = useNuxtApp();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].likedBy?.push(uuidv4());
        await $firebase.updateDoc(
          $firebase.doc(
            $firebase.db,
            "users",
            "SLshmJdXrvfTyACar6MGhWLetjX2",
            "userNotes",
            key
          ),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding like to post:", error);
      }
    },
    async dislikePostById(postId: string) {
      const { $firebase } = useNuxtApp();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].dislikedBy?.push(uuidv4());
        await $firebase.updateDoc(
          $firebase.doc(
            $firebase.db,
            "users",
            "SLshmJdXrvfTyACar6MGhWLetjX2",
            "userNotes",
            key
          ),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error removing like from post:", error);
      }
    },
    async addComment(postId: string, comment: Comment) {
      const { $firebase } = useNuxtApp();
      const post = findPostById(postId, this.posts);
      const key = findPostKeyById(postId, this.posts);
      if (!post || !key) return console.error("post not found");
      try {
        this.posts[key].comments?.push(comment);
        await $firebase.updateDoc(
          $firebase.doc(
            $firebase.db,
            "users",
            "SLshmJdXrvfTyACar6MGhWLetjX2",
            "userNotes",
            key
          ),
          this.posts[key]
        );
      } catch (error) {
        console.error("Error adding comment to post:", error);
      }
    },
  },
  persist: true,
});
