<template>
    <div class="container">

        <div class="back">
            <div class="button" @click="back">←</div>
        </div>

        <div class="content">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </div>

        <div class="sidebar">
            <div class="link">
                <router-link :to="{ name: rName ? 'manageAccountInfo' : 'accountInfo', query: { id: operatorId } }"
                    active-class="active-class">
                    账号信息
                </router-link>
            </div>
            <div class="link">
                <router-link :to="{ name: rName ? 'managePersonalInfo' : 'personalInfo', query: { id: operatorId } }"
                    active-class="active-class">
                    个人信息
                </router-link>
            </div>
            <div class="link">
                <router-link :to="{ name: rName ? 'manageExamInfo' : 'examInfo', query: { id: operatorId } }"
                    active-class="active-class">
                    体检测试
                </router-link>
            </div>
            <div class="link">
                <router-link
                    :to="{ name: rName ? 'manageArchivesInfo' : 'archivesInfo', query: { id: operatorId, name: operatorName } }"
                    active-class="active-class">
                    档案信息
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin'
import UtilMixin from '@/mixins/UtilMixin'
import { mapState } from 'vuex'
export default {
    name: 'PersonalCenter',
    mixins: [AxiosMixin, UtilMixin],
    props: ['id', 'name', 'routeName'],
    data() {
        return {
            rName: '',
            operatorId: '',
            operatorName: '',
        }
    },
    methods: {
        back() {
            if (this.rName) {
                this.$router.push({ name: 'operatorList' })
            } else {
                this.$router.push({ name: 'homePage' })
            }
        }
    },
    computed: {
        ...mapState(["currentUser"]),
    },
    activated() {
        if (this.routeName) {
            this.rName = this.routeName;
        }
        if (this.id) {
            this.operatorId = this.id;
        }
        if (this.name) {
            this.operatorName = this.name;
        }
        if (this.rName) {
            this.$router.replace({ name: this.routeName, query: { id: this.id, name: this.name } });
        }
    },
    mounted() {
        const identificationCode = this.$md5(this.currentUser.id + this.currentUser.password + this.currentUser.authority);
        //debugger;
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
                if (!this.rName) {
                    this.$router.replace({ name: 'accountInfo', query: { id: '', name: '' } });
                }
            } else {
                this.logOut();
            }
        })
    },
}
</script>

<style lang="less" scoped>
.container {
    height: 540px;
    margin: 0 200px 0 100px;
    position: relative;

    .back {
        position: absolute;
        top: -30px;
        left: 10px;

        .button {
            color: #c9cbd0;
            font-size: 30px;
            font-weight: bolder;
            cursor: pointer;

            &:hover {
                color: #22bbff;
            }
        }
    }

    .content {
        height: 540px;
    }


    .sidebar {
        width: 100px;
        height: 540px;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-end;

        .link {
            a {
                color: #c9cbd0;
                font-weight: bold;

                &:hover {
                    color: #e7e7e7;
                }
            }

            .active-class {
                color: #22bbff;
                padding-right: 10px;
                border-right: 5px solid #22bbff;

                &:hover {
                    color: #22bbff;
                }
            }
        }
    }
}
</style>