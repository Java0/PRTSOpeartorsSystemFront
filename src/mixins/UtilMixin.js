import { mapMutations } from 'vuex';
export default {
    data() {
        return {

        }
    },

    methods: {
        ...mapMutations(['setLoginState', 'setCurrentUser']),
        logOut() {
            this.setLoginState(false);
            this.setCurrentUser(null);
            this.$cookies.keys().forEach(key => {
                this.$cookies.remove(key);
            })
            localStorage.clear();
            window.location.reload();
        },
        setCookie(key, value, maxAge) {
            this.$cookies.set(key, value, `${maxAge}s`);
        }
    },

}