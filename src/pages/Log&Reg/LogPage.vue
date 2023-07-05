<template>
  <div class="container">
    <form action="" class="reg-from">
      <div class="input-block">
        <div class="name-box">
          <div class="avatar">
            <img :src="avatarBase64" alt="" v-if="avatarBase64">
          </div>
          <input type="te" class="text-in name" placeholder="代号*" v-model.lazy="name" ref="input1"
            @keypress.enter.prevent="handleEnterPress($event, 1)" @blur="getAvatar">
        </div>
      </div>

      <div class="input-block">
        <input type="password" autocomplete="off" class="text-in password" placeholder="密码*" v-model.lazy="password"
          ref="input2" @keypress.enter.prevent="handleEnterPress($event, 2)">
      </div>

      <div class="input-block">
        <div class="check-block" @click="rememberClick()">
          <div class="remember" ref="remember"></div>
          <span>三日内免登录</span>
        </div>
      </div>

      <div class="input-block">
        <div class="button-box">
          <button class="login-button" ref="loginButton" @click.prevent="login">登录</button>
        </div>
      </div>
    </form>

    <div class="log-dialog" v-if="failInfo" @click="dialogClick">
      <div>{{ failInfo }}</div>
    </div>
  </div>
</template>
  
<script>
import AxiosMixin from '@/mixins/AxiosMixin';
import { mapMutations, mapState } from 'vuex'
import UtilMixin from '@/mixins/UtilMixin';
export default {
  name: 'RegPage',
  mixins: [AxiosMixin, UtilMixin],
  data() {
    return {
      name: '凯尔希',
      password: 'Kaierxi123456@',
      remember: false,
      avatarBase64: null,
      failInfo: '',
      uploading: false,

      operatorInfo: null,
      operatorExam: null,
      operatorArchives: null,
      maxAge: 0
    }
  },
  computed: {
    ...mapState(['isLogined', 'currentUser']),
  },

  methods: {
    ...mapMutations(['setLoginState', 'setCurrentUser']),
    getAvatar(callback) {
      if (!this.name) return;
      this.sendRequest(
        {
          method: 'GET',
          url: 'account/getAvatar',
          params: {
            name: this.name
          }
        }
      ).then(
        ({ data }) => {
          this.avatarBase64 = data
          if (typeof callback === 'function') {
            callback();
          }
        }
      )
    },

    handleEnterPress(e, index) {
      const target = e.target;
      const next = this.$refs[`input${index + 1}`];
      if (next) {
        next.focus();
      } else {
        target.blur();
      }
    },

    rememberClick() {
      const remember = this.$refs.remember;
      remember.classList.toggle('remember-active');
      this.remember = !this.remember;
    },

    dialogClick() {
      this.failInfo = ''
    },


    login() {

      if (this.uploading) return

      if (!this.name || !this.password) return

      const loginButton = this.$refs.loginButton;

      loginButton.classList.add('login-button-disabled');
      this.uploading = true;
      this.sendRequest(
        {
          method: 'POST',
          url: '/account/login',
          data: {
            name: this.name,
            password: this.$md5(this.password),
            remember: this.remember
          }
        }
      ).then(
        ({ data }) => {
          loginButton.classList.remove('login-button-disabled');
          this.uploading = false;
          if (data.state !== 'success') {
            this.failInfo = data.description;
            return;
          }

          this.setLoginState(true);
          this.setCurrentUser(
            {
              order: data.order,
              id: data.id,
              name: this.name,
              password: this.$md5(this.password),
              authority: data.authority,
            }
          );
          this.maxAge = parseInt(data.maxAge) * 24 * 60 * 60;


          this.sendRequest(
            {
              method: 'GET',
              url: '/info/getAll',
              params: {
                id: this.currentUser.id
              }
            }
          ).then(
            ({ data }) => {
              this.operatorInfo = data.operatorInfo;
              this.operatorExam = data.operatorExam;
              this.operatorArchives = data.operatorArchives;
              if (!this.avatarBase64) {
                this.getAvatar(this.setCookiesAndToHomepage)
              } else {
                this.setCookiesAndToHomepage();
              }
            }
          );
        }
      )
    },
    setCookiesAndToHomepage() {
      const timeStamp = Date.now();
      this.setCookie('operatorAccount', JSON.stringify({ ...this.currentUser, timeStamp }), this.maxAge, 'd');
      this.setCookie('__maxage_operatorAccount', this.maxAge, this.maxAge, 'd');
      this.setCookie('operatorInfo', { ...this.operatorInfo, timeStamp }, this.maxAge, 'd');
      this.setCookie('__maxage_operatorInfo', this.maxAge, this.maxAge, 'd');
      this.setCookie('operatorExam', { ...this.operatorExam, timeStamp }, this.maxAge, 'd');
      this.setCookie('__maxage_operatorExam', this.maxAge, this.maxAge, 'd');
      localStorage.setItem('operatorArchives', JSON.stringify(this.operatorArchives));
      localStorage.setItem('operatorAvatar', this.avatarBase64);
      this.$bus.$emit('getAvatarFromLoginPage', this.avatarBase64);
      this.$router.replace('home-page');
    },

  },

}
</script>
  
<style lang="less" scoped>
.container {
  height: 550px;
  margin: 0 200px 0 100px;
  display: flex;
  justify-content: center;

  .reg-from {
    width: 700px;
    height: 550px;
    display: flex;
    flex-direction: column;


    .input-block {
      width: 700px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-top: 15px;

      .text-in {
        left: 0;
        width: 400px;
        height: 40px;
        background-color: #404040 !important;
        color: #c9cbd0;
        box-shadow: inset 1px 3px 3px #232323;
        border: 0;
        padding-left: 15px;
        box-sizing: border-box;
      }

      .check-block {
        width: 400px;
        height: 25px;
        border: 1px solid #c9cbd0;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .remember {
          width: 13px;
          height: 13px;
          border: 1px solid #c9cbd0;
          box-sizing: border-box;
          margin-left: 15px;
          cursor: pointer;
        }

        .remember-active {
          background-color: #fff;
          box-shadow: 0px 0px 5px 1px #fff;
        }

        span {
          color: #c9cbd0;
          margin-left: 15px;
        }
      }


      .button-box {
        display: flex;
        justify-content: space-evenly;

        .login-button {
          width: 400px;
          height: 40px;
          background-color: #404040;
          border: 1px solid #c9cbd0;
          color: #c9cbd0;
          cursor: pointer;
        }

        .login-button-disabled {
          color: #616061;
          border: 1px solid #616061;
          cursor: not-allowed;
        }

      }

      .name-box {
        display: flex;
        flex-direction: column;
        align-items: center;

        .avatar {
          width: 200px;
          height: 200px;
          background-color: #454545;
          border-radius: 10px;
          margin-bottom: 30px;

          img {
            width: 200px;
            height: 200px;
            background-color: #454545;
            border-radius: 10px;
            margin-bottom: 30px;
          }
        }
      }


      .warn {
        width: 250px;
        color: orangered;
      }

      .warn-hidden {
        visibility: hidden;
      }


    }
  }


  .log-dialog {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;

    display: flex;
    justify-content: center;
    align-items: center;

    div {
      width: 300px;
      height: 150px;
      background-color: #404040;
      box-shadow: 5px 5px 5px #232323;
      color: #c9cbd0;
      text-align: center;
      line-height: 150px;

      span {
        color: orangered;
      }
    }
  }



}
</style>