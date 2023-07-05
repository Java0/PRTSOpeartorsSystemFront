<template>
  <div class="container">
    <div class="header header-left">
      <img src="../assets/Rhodes Island.png" alt="Rhodes Island" class="logo">

      <router-link to="/home-page" :class="this.isLogined ? 'btn btn-homepage' : 'btn btn-homepage btn-disabled'"
        active-class="righht-btn-active">
        首页
      </router-link>
      <router-link to="/manage" :class="this.isLogined && this.currentUser.authority > 5 ? 'btn btn-manage' : 'btn btn-manage btn-disabled'"
        active-class="righht-btn-active">
        管理
      </router-link>
    </div>

    <div class="header header-right">
      <div class="avatar" v-if="this.$route.path !== '/home-page'">
        <img :src="avatarBase64 || ''" alt="" v-if="avatarBase64">
      </div>

      <router-link to="/login" class="btn" v-if="!this.isLogined">登录</router-link>
      <router-link to="/personal-center" class="btn btn1" active-class="left-btn-active" v-else>个人中心</router-link>


      <router-link to="/register" class="btn" v-if="!this.isLogined">注册</router-link>
      <div class="btn" @click="logOut" v-else>登出</div>
    </div>

  </div>
</template>

<script>
import UtilMixin from '@/mixins/UtilMixin';
import { mapMutations, mapState } from 'vuex';
export default {
  name: 'SystemHeader',
  mixins: [UtilMixin],
  data() {
    return {
      avatarBase64: null,
    }
  },
  computed: {
    ...mapState(['isLogined', 'currentUser'])
  },
  methods: {
    ...mapMutations(['setLoginState', 'setCurrentUser']),
  },

  mounted() {
    this.$bus.$on('getAvatarFromLoginPage', (avatarBase64) => {
      this.avatarBase64 = avatarBase64;
    });

    this.$nextTick(() =>{
      this.avatarBase64 = localStorage.getItem('operatorAvatar');
    })
  },
  destroyed() {
    this.$bus.$off('getAvatarFromLoginPage');
  }
}
</script>

<style scoped lang="less">
.container {
  height: 250px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c9cbd0;
  a{
    color: #c9cbd0;
  }
  
  .header {
    display: flex;
    align-items: center;
  }

  @margin: 100px;

  .header-left {
    .logo {
      height: 100px;
      margin-left: @margin;
    }

    .btn {
      height: 35px;
      line-height: 35px;
      margin-left: calc(@margin / 2);

      cursor: pointer;

      &:hover {
        color: #e7e7e7;
      }
    }

    .righht-btn-active {
      color: #22bbff;
      border-bottom: 3px solid #22bbff;
    }

    .btn-disabled {
      color: #797979;
      cursor: not-allowed;

      &:hover {
        color: #797979;
      }
    }

  }

  .header-right {
    margin-right: calc(@margin * 2);

    .avatar {
      width: 50px;
      height: 50px;
      background-color: #454545;
      border-radius: 100px;

      img {
        width: 50px;
        height: 50px;
        background-color: #454545;
        border-radius: 100px;
      }
    }

    .btn {
      padding: 0 11px;
      cursor: pointer;

      &:hover {
        color: #e7e7e7;
      }
    }

    .btn1 {
      border-right: 2px solid #c9cbd0;
    }

    .left-btn-active {
      color: #22bbff;
    }
  }
}
</style>
