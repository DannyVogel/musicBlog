export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    userName: "",
    userUID: "",
  }),
  getters: {},
  actions: {
    init() {
      const { $firebase } = useNuxtApp();

      $firebase.onAuthStateChanged($firebase.auth, (user) => {
        if (user) {
          $firebase
            .getDoc($firebase.doc($firebase.db, "users", user.uid))
            .then((doc) => {
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
      const { $firebase } = useNuxtApp();

      try {
        const data = await $firebase.signInWithEmailAndPassword(
          $firebase.auth,
          email,
          password
        );
        $firebase
          .getDoc($firebase.doc($firebase.db, "users", data.user.uid))
          .then((doc) => {
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
      const { $firebase } = useNuxtApp();

      try {
        await $firebase.signOut($firebase.auth);
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
  persist: true,
});
