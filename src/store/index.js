import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const actions = {};

const mutations = {
    setLoginState(state, value){
        state.isLogined = value;
    },
    setCurrentUser(state, value){
        state.currentUser = value;
    },
};

const state = {
    isLogined: false,
    currentUser: null,
};

export default new Vuex.Store({
    actions,
    mutations,
    state
})