import { defineStore } from "pinia";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  auth,
  signOut,
  getDoc,
  doc,
  db,
} from "@/config/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    userName: "",
    userUID: "",
  }),
  getters: {},
  actions: {
    init() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          getDoc(doc(db, "users", user.uid)).then((doc) => {
            if (doc.exists()) {
              this.userName = user.displayName ?? "";
              this.isLoggedIn = true;
              this.userUID = user.uid;
            }
          });
        } else {
          // User is signed out
          this.isLoggedIn = false;
          this.userName = "";
          this.userUID = "";
        }
      });
    },
    async signIn(email: string, password: string) {
      try {
        const data = await signInWithEmailAndPassword(auth, email, password);
        getDoc(doc(db, "users", data.user.uid)).then((doc) => {
          if (doc.exists()) {
            this.isLoggedIn = true;
            this.userName = doc.data().userName;
            this.userUID = doc.data().userUID;
          }
        });
        return "success";
      } catch (error: any) {
        console.log(error.code, error.message);
        return error.message;
      }
    },
    async logOut() {
      try {
        await signOut(auth);
        this.isLoggedIn = false;
        this.userName = "";
        this.userUID = "";
        return "success";
      } catch (error: Error | any) {
        console.log(error);
        return error.message;
      }
    },
  },
});
