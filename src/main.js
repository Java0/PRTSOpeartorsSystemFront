import Vue from 'vue'
import App from './App.vue'

//router
import router from '@/router'

//vuex
import store from '@/store'

// styles
import './assets/css/normalize.css'

//lodash
import _ from 'lodash'
Vue.prototype._ = _;

//Axios
import axios from '@/utils/axios'
Vue.prototype.$axios = axios;

//cookie
import VueCookies  from 'vue-cookies'
Vue.use(VueCookies);

//MD5
import { hexMD5 } from '@/utils/md5'
Vue.prototype.$md5 = hexMD5;

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app')
