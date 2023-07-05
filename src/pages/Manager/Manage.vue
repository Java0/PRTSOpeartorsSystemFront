<template>
  <div class="container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin'
import UtilMixin from '@/mixins/UtilMixin'

import { mapState } from 'vuex'
export default {
  name: 'Manage',
  mixins: [AxiosMixin, UtilMixin],
  computed: {
    ...mapState(["currentUser"]),
  },
  mounted() {
    const identificationCode = this.$md5(this.currentUser.id + this.currentUser.password + this.currentUser.authority);

    this.sendRequest(
      {
        method: 'POST',
        url: '/account/checkLoginState',
        data: {
          id: this.currentUser.id,
          identificationCode: identificationCode
        }
      }
    ).then(({ data }) => {
      if (data) {
        this.$router.replace({ name: 'operatorList' });
      } else {
        this.logOut();
      }
    })

  },
  activated() {
    this.$router.replace({ name: 'operatorList' });
  }
}
</script>

<style></style>