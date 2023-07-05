<template>
    <div class="container">
        <div class="avatar">
            <AvatarUploader :inputAvatar="oldAvatar" ref="avatarUpload" />
            <div class="cover" @click="changeAvatar">
                +
            </div>
        </div>

        <div class="content" v-if="this.operatorAccount">

            <div class="info name">
                代号: {{ operatorAccount.name }}
            </div>

            <div class="info id">
                ID: {{ operatorAccount.id }}
            </div>

            <div class="info order">
                序列: {{ operatorAccount.order }}
            </div>

            <div class="info authority" @click="editAuthority">
                <input type="text" v-if="authorityEdit" v-model.lazy="newAuthority" ref="authorityInput"
                    @blur="() => { this.authorityEdit = false; }">
                <div class="text" v-else>权限：Level.{{ newAuthority || operatorAccount.authority }}</div>
            </div>

        </div>

        <div class="save" v-if="showSave">
            <button class="save-button" @click="saveChange" ref="saveButton">保存修改</button>
        </div>

    </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin';
import { mapState } from 'vuex'
import AvatarUploader from '../Log&Reg/AvatarUploader.vue';
export default {
    name: "AccountInfo",
    components: { AvatarUploader },
    mixins: [AxiosMixin],
    props: ['id'],
    data() {
        return {
            operatorAccount: null,
            newAuthority: '',
            authorityEdit: false,
            oldAvatar: null,
            newAvatar: null,
            compressedAvatar: null,
            showSave: false
        };
    },
    methods: {
        init() {
            const id = this.id;
            if (!id) {
                this.operatorAccount = this.currentUser;
                this.oldAvatar = localStorage.getItem("operatorAvatar");
            } else {
                this.sendRequest({
                    method: 'GET',
                    url: '/info/getOperatorAccount',
                    params: {
                        id: id
                    }
                }).then(({ data }) => {
                    this.operatorAccount = data;
                    this.oldAvatar = data.avatar;
                })
            }
        },
        editAuthority() {
            if (this.currentUser.authority >= 7 && this.id) {
                this.authorityEdit = true;
                this.$nextTick(() => {
                    this.$refs.authorityInput.focus();
                });
            }

        },
        changeAvatar() {
            this.$refs.avatarUpload.clickAvatarIn();
        },
        saveChange() {
            const saveButton = this.$refs.saveButton;
            saveButton.classList.add('save-button-disabled');
            if (this.newAvatar) {
                this.sendRequest(
                    {
                        method: 'POST',
                        url: '/info/changeAvatar',
                        data: {
                            id: this.id || this.operatorAccount.id,
                            avatar: this.newAvatar,
                            compressedAvatar: this.compressedAvatar
                        }
                    }
                ).then(
                    ({ data }) => {
                        if (data.state === 'success') {
                            saveButton.classList.remove('save-button-disabled');
                            if (this.id) {
                                this.init();
                                this.showSave = false;
                            } else {
                                localStorage.setItem('operatorAvatar', this.newAvatar);
                                this.init();
                                this.showSave = false;
                            }
                        }
                    }
                );
            } else {
                this.sendRequest(
                    {
                        method: 'POST',
                        url: '/info/changeAuthority',
                        data: {
                            id: this.id || this.operatorAccount.id,
                            authority: this.newAuthority
                        }
                    }
                ).then(({ data }) => {
                    if (data.state === 'success') {
                        saveButton.classList.remove('save-button-disabled');
                        this.newAuthority = '';
                        this.init();
                        this.showSave = false;
                    }
                })
            }
        },
    },
    watch: {
        newAuthority(newValue) {
            if (!newValue) return;
            if (newValue != this.operatorAccount.authority) {
                this.showSave = true;
            } else {
                this.showSave = false;
            }
        }
    },
    computed: {
        ...mapState(["currentUser"]),
    },
    activated() {
        this.init();
    },
    mounted() {
        this.$bus.$on('getNewAvatar', (obj) => {
            this.newAvatar = obj.avatar;
            this.compressedAvatar = obj.compressedAvatar
            this.showSave = true;
        });
    }

}
</script>

<style scoped lang="less">
.container {
    height: 540px;
    margin: 0 200px 0 100px;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #c9cbd0;

    .avatar {
        width: 200px;
        height: 200px;
        background-color: #454545;
        border-radius: 10px;
        margin-bottom: 30px;
        position: relative;

        img {
            width: 200px;
            height: 200px;
            background-color: #454545;
            border-radius: 10px;
            margin-bottom: 30px;
        }


        .cover {
            width: 200px;
            height: 200px;
            position: absolute;
            z-index: 0;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
            background-color: #000;
            opacity: 0;
            cursor: pointer;

            &:hover {
                opacity: 0.5;
            }


        }

    }

    .content {
        margin-top: 50px;

        .info {
            display: flex;
            justify-content: center;
            margin-top: 15px;
            font-size: 20px;
        }

        .authority {
            &:hover {
                background-color: #2b2b2b;
                cursor: pointer;
            }
        }


    }

    .save {
        position: absolute;
        top: 580px;
        color: #c9cbd0;
        .save-button {
            width: 400px;
            height: 40px;
            background-color: #404040;
            border: 1px solid #c9cbd0;
            cursor: pointer;
        }

        .save-button-disabled {
            color: #616061;
            border: 1px solid #616061;
            cursor: not-allowed;
        }
    }

}
</style>