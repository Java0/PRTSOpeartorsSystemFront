<template>
  <div class="container">
    <form action="" class="reg-from">

      <div class="input-block">
        <AvatarUploader />
        <div class="warn-box">
          <div class="warn warn-hidden" ref="avatarWarn">请上传样貌信息</div>
        </div>
      </div>

      <div class="input-block">
        <input type="te" class="text-in name" name="name" placeholder="代号*" v-model.lazy="name.value" ref="input1"
          @blur="nameCheck" @keypress.enter.prevent="handleEnterPress($event, 1)">
        <div class="warn-box">
          <div class="warn warn-hidden" ref="nameWarn">代号长度不可超过10</div>
        </div>
      </div>

      <div class="input-block">
        <input type="password" autocomplete="off" class="text-in password" name="password" placeholder="密码*"
          v-model.lazy="password.value" ref="input2" @blur="passwordCheck"
          @keypress.enter.prevent="handleEnterPress($event, 2)">
        <div class="warn-box">
          <div class="warn warn-hidden" ref="passwordWarn">请输入8-20位，包含数字，小写字母，大写字母及符号的密码</div>
        </div>
      </div>

      <div class="input-block">
        <input type="password" autocomplete="off" class="text-in password-repeat" name="passwordRepeat"
          placeholder="重复密码*" v-model.lazy="passwordRepeat.value" ref="input3" @blur="passwordRepeatCheck"
          @keypress.enter.prevent="handleEnterPress($event, 3)">
        <div class="warn-box">

          <div class="warn warn-hidden" ref="passwordRepeatWarn">两次密码的输入不一致</div>
        </div>
      </div>

      <div class="input-block">
        <input type="text" autocomplete="off" class="text-in sex" name="sex" placeholder="性别*" v-model.lazy="sex.value"
          ref="input4" @blur="sexCheck" @keypress.enter.prevent="handleEnterPress($event, 4)">
        <div class="warn-box">
          <div class="warn warn-hidden" ref="sexWarn">请输入男/女</div>
        </div>
      </div>


      <div class="input-block">
        <div class="check-block" @click="agreementClick()">
          <div class="agreement" ref="agreement"></div>
          <span>我已阅读并同意<a href="">注册协议</a>和<a href="">隐私协议</a></span>
        </div>
        <div class="warn-box">
          <div class="warn warn-hidden" ref="agreementWarn">请先阅读并同意用户协议及隐私协议</div>
        </div>
      </div>
      <div class="input-block">
        <div class="button-box">
          <button class="reg-button" @click.prevent="rigister" ref="regButton">注册</button>
        </div>
        <div class="warn-box">
          <div class="warn warn-hidden" ref="failInfo">{{ failInfo }}</div>
        </div>
      </div>
    </form>

    <div class="reg-dialog" v-if="showDialog">
      <div>注册成功，将于<span>{{ timer }}</span>秒后返回主页。</div>
    </div>


  </div>
</template>
  
<script>
import AvatarUploader from "@/pages/Log&Reg/AvatarUploader"
import AxiosMixin from '@/mixins/AxiosMixin'

export default {
  name: 'RegPage',
  mixins: [AxiosMixin],
  components: {
    AvatarUploader
  },
  data() {
    return {
      name: {
        value: '',
        checked: false
      },
      password: {
        value: '',
        checked: false
      },
      passwordRepeat: {
        value: '',
        checked: false
      },
      sex: {
        value: '',
        checked: false
      },
      avatarBase64: null,
      compressedAvatar: null,
      agreement: false,
      failInfo: '',
      showDialog: false,
      timer: 3,
      uploading: false,
    }
  },

  methods: {
    nameCheck() {
      if (this.name.value.length === 0) {
        this.name.checked = false;
        return;
      }

      const warn = this.$refs.nameWarn;
      if (this.name.value.length <= 10) {
        this.name.checked = true;
        warn.classList.add('warn-hidden');
      } else {
        warn.classList.remove('warn-hidden');
      }
    },
    passwordCheck() {
      const warn = this.$refs.passwordWarn;
      const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,20}/;
      const value = this.password.value;
      this.password.checked = reg.test(value);

      if (value.length == 0 || this.password.checked) {
        warn.classList.add('warn-hidden');
      } else {
        warn.classList.remove('warn-hidden');
      }
    },
    passwordRepeatCheck() {
      const warn = this.$refs.passwordRepeatWarn;
      const value = this.passwordRepeat.value;
      this.passwordRepeat.checked = value === this.password.value;
      if (value.length == 0 || this.passwordRepeat.checked) {
        warn.classList.add('warn-hidden');
      } else {
        warn.classList.remove('warn-hidden');
      }
    },
    sexCheck() {
      const warn = this.$refs.sexWarn;
      const value = this.sex.value;
      this.sex.checked = value === '男' || value === '女';
      if (value.length == 0 || this.sex.checked) {
        warn.classList.add('warn-hidden');
      } else {
        warn.classList.remove('warn-hidden');
      }
    },
    agreementClick() {
      const warn = this.$refs.agreementWarn;
      const agreement = this.$refs.agreement;
      agreement.classList.toggle('agreement-active');
      this.agreement = !this.agreement;

      if (this.agreement) {
        warn.classList.add('warn-hidden');
      } else {
        warn.classList.remove('warn-hidden');
      }
    },
    handleEnterPress(e, index) {
      const target = e.target;
      const name = target.name;
      this[`${name}Check`]();
      const next = this.$refs[`input${index + 1}`];
      if (next) {
        next.focus();
      } else {
        target.blur();
      }
    },
    rigister() {
      if (this.uploading) return;
      if (!this.agreement || !this.name.checked || !this.password.checked || !this.passwordRepeat.checked || !this.sex.checked) {
        return;
      }

      const avatarWarn = this.$refs.avatarWarn;
      if (!this.avatarBase64) {
        avatarWarn.classList.remove('warn-hidden');
        return;
      }

      const regButton = this.$refs.regButton;
      const failInfo = this.$refs.failInfo;

      regButton.classList.add('reg-button-disabled');
      this.uploading = true
      this.sendRequest(
        {
          method: 'POST',
          url: '/account/register',
          data: {
            name: this.name.value,
            password: this.$md5(this.password.value),
            sex: this.sex.value,
            avatar: this.avatarBase64,
            compressedAvatar: this.compressedAvatar
          }
        }
      ).then(
        ({ data }) => {
          regButton.classList.remove('reg-button-disabled');
          this.uploading = false
          avatarWarn.classList.add('warn-hidden');
          failInfo.classList.add('warn-hidden');
          if (data.state === 'success') {
            this.showDialog = true;
            let interval = setInterval(() => {
              this.timer--;
              if (this.timer == 0) {
                this.$router.replace('/visitor-home-page');
                clearInterval(interval);
              }
            }, 1000);
          } else {
            this.failInfo = data.description;
            failInfo.classList.remove('warn-hidden');
          }
        }
      )
    },
  },

  mounted() {
    this.$bus.$on('getAvatarFromUploader', (obj) => {
      this.avatarBase64 = obj.avatar;
      this.compressedAvatar = obj.compressedAvatar;
    })
  },
  destroyed() {
    this.$bus.$off('getAvatarFromUploader');
  }
}
</script>
  
<style lang="less" scoped>
.container {
  height: 550px;
  margin: 0 200px 0 100px;

  .reg-from {
    width: 700px;
    height: 550px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;

    .input-block {
      width: 700px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 15px;

      .text-in {
        left: 0;
        width: 400px;
        height: 40px;
        background-color: #404040;
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
        justify-content: space-around;
        align-items: center;

        .agreement {
          width: 13px;
          height: 13px;
          border: 1px solid #c9cbd0;
          box-sizing: border-box;
          cursor: pointer;
        }

        .agreement-active {
          background-color: #fff;
          box-shadow: 0px 0px 5px 1px #fff;
        }

        span {
          color: #c9cbd0;

          a {
            color: #22bbff;
          }

        }
      }

      .button-box {
        display: flex;
        justify-content: space-evenly;

        .reg-button {
          width: 400px;
          height: 40px;
          background-color: #404040;
          border: 1px solid #c9cbd0;
          color: #c9cbd0;
          cursor: pointer;
        }

        .reg-button-disabled {
          color: #616061;
          border: 1px solid #616061;
          cursor: not-allowed;
        }


      }

      .warn-box {
        height: 40px;
        position: relative;

        .warn {
          width: 500px;
          color: orangered;
          position: absolute;
          left: 50px;
        }
      }

      .warn-hidden {
        visibility: hidden;
      }

    }
  }

  .reg-dialog {
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