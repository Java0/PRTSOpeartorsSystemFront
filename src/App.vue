<template>
  <div id="app">
    <SystemHeader />
    <keep-alive :include="['HomePage', 'Manage']">
      <router-view />
    </keep-alive>
    <SystemFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mapMutations } from 'vuex';
import SystemHeader from "./components/SystemHeader.vue"
import SystemFooter from "./components/SystemFooter.vue"

import AxiosMixin from './mixins/AxiosMixin';
import UtilMixin from './mixins/UtilMixin';
export default {
  name: 'App',
  mixins: [AxiosMixin, UtilMixin],
  components: {
    SystemHeader,
    SystemFooter
  },
  computed: {
    ...mapState(['isLogined', 'currentUser']),
  },
  methods: {
    ...mapMutations(['setLoginState', 'setCurrentUser']),
  },
  mounted() {

    const operatorAccount = this.$cookies.get('operatorAccount');
    if (operatorAccount && this.$cookies.get('__maxage_operatorAccount') && this.$cookies.get('operatorInfo') && this.$cookies.get('__maxage_operatorInfo') && this.$cookies.get('operatorExam') && this.$cookies.get('__maxage_operatorExam')) {
      this.setCurrentUser(operatorAccount);
      this.setLoginState(true);
    } else {
      this.setLoginState(false);
      this.setCurrentUser(null);
      this.$cookies.keys().forEach(key => {
        this.$cookies.remove(key);
      })
      localStorage.clear();
    }

    if (this.isLogined) {
      this.$router.replace('/home-page');
    } else {
      this.$router.replace('/visitor-home-page');
    }
  }
}
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

body {
  margin: 0;
  background: #353535;
}

a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}

/deep/ input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 0px transparent inset !important;
}

input:-internal-autofill-previewed,
input:-internal-autofill-selected {
  -webkit-text-fill-color: #c9cbd0 !important;
  transition: background-color 5000s ease-in-out 0s !important;
}

/deep/ input:-internal-autofill-selected {
  transition: background-color 5000s ease-in-out 0s !important;
  background-color: transparent !important;
}
</style>
