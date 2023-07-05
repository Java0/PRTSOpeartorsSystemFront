<template>
    <div class="container">
        <img :src="avatar" alt="" class="avatar">
        <div class="content" v-if="operatorInfo">
            <div class="info">
                <div class="key">性别：</div>
                <div class="value">{{ operatorInfo.sex }}</div>
            </div>
            <div class="info" @click="handleClick('combatExperience')">
                <div class="key">战斗经验：</div>
                <input type="text" v-if="editCheck.combatExperienceEdit" v-model.lazy="combatExperience"
                    @blur="handleBlur('combatExperience')" ref="combatExperienceInput">
                <div class="value" v-else>{{ combatExperience || operatorInfo.combatExperience || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('birthplace')">
                <div class="key">出生地：</div>
                <input type="text" v-if="editCheck.birthplaceEdit" v-model.lazy="birthplace"
                    @blur="handleBlur('birthplace')" ref="birthplaceInput">
                <div class="value" v-else>{{ birthplace || operatorInfo.birthplace || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('birthday')">
                <div class="key">出生日期：</div>
                <input type="text" v-if="editCheck.birthdayEdit" v-model.lazy="birthday" @blur="handleBlur('birthday')"
                    ref="birthdayInput">
                <div class="value" v-else>{{ birthday || operatorInfo.birthday || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('height')">
                <div class="key">身高：</div>
                <input type="text" v-if="editCheck.heightEdit" v-model.lazy="height" @blur="handleBlur('height')"
                    ref="heightInput">
                <div class="value" v-else>{{ height || operatorInfo.height || defaultText }}</div><span
                    v-if="height || operatorInfo.height">cm</span>
            </div>
            <div class="info" @click="handleClick('race')">
                <div class="key">种族：</div>
                <input type="text" v-if="editCheck.raceEdit" v-model.lazy="race" @blur="handleBlur('race')" ref="raceInput">
                <div class="value" v-else>{{ race || operatorInfo.race || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('profession')">
                <div class="key">职业：</div>
                <input type="text" v-if="editCheck.professionEdit" v-model.lazy="profession"
                    @blur="handleBlur('profession')" ref="professionInput">
                <div class="value" v-else>{{ profession || operatorInfo.profession || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('organization')">
                <div class="key">现属组织：</div>
                <input type="text" v-if="editCheck.organizationEdit" v-model.lazy="organization"
                    @blur="handleBlur('organization')" ref="organizationInput">
                <div class="value" v-else>{{ organization || operatorInfo.organization || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('oripathyInfectionStatus')">
                <div class="key">矿石病感染情况：</div>
                <input type="text" v-if="editCheck.oripathyInfectionStatusEdit" v-model.lazy="oripathyInfectionStatus"
                    @blur="handleBlur('oripathyInfectionStatus')" ref="oripathyInfectionStatusInput">
                <div class="value" v-else>{{ oripathyInfectionStatus || operatorInfo.oripathyInfectionStatus || defaultText
                }}</div>
            </div>
        </div>

        <div class="upload">
            <button class="upload-button" v-if="showUpload" ref="uploadButton" @click="handleSave">保存修改</button>
        </div>

        <div class="dialog" v-if="showDialog">
            <div class="dialog-container">
                <div class="text-box">检测到权限不足，首次上传信息后<span>内容将无法更改。</span></div>
                <div class="button-box">
                    <div class="button" @click="uploadChange">确定上传</div>
                    <div class="button" @click="() => { this.showDialog = false }">取消上传</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin';
import { mapState } from 'vuex'
import UtilMixin from '@/mixins/UtilMixin';
export default {
    name: 'PersonalInfo',
    props: ['id'],
    data() {
        return {
            avatar: null,
            operatorInfo: null,
            combatExperience: '',
            birthplace: '',
            birthday: '',
            height: '',
            race: '',
            profession: '',
            organization: '',
            oripathyInfectionStatus: '',
            editCheck: {
                combatExperienceEdit: false,
                birthplaceEdit: false,
                birthdayEdit: false,
                heightEdit: false,
                raceEdit: false,
                professionEdit: false,
                organizationEdit: false,
                oripathyInfectionStatusEdit: false
            },
            showUpload: false,
            defaultText: '待补全',
            uploading: false,
            showDialog: false
        }
    },
    mixins: [AxiosMixin, UtilMixin],
    computed: {
        ...mapState(['currentUser']),
    },
    methods: {
        init() {
            const id = this.id;
            if (!id) {
                this.operatorInfo = this.$cookies.get('operatorInfo')
                this.avatar = localStorage.getItem("operatorAvatar");
            } else {
                this.sendRequest({
                    method: 'GET',
                    url: '/info/getOperatorInfo',
                    params: {
                        id: id
                    }
                }).then(({ data }) => {
                    this.operatorInfo = data;
                })

                this.sendRequest({
                    method: 'GET',
                    url: '/info/getAvatar',
                    params: {
                        id: id
                    }

                }).then(({ data }) => {
                    this.avatar = data;
                })
            }
        },
        clear() {
            this.combatExperience = '';
            this.birthplace = '';
            this.birthday = '';
            this.height = '';
            this.race = '';
            this.profession = '';
            this.organization = '';
            this.oripathyInfectionStatus = '';
        },
        handleClick(name) {
            if (this.currentUser.authority < 6 && this.operatorInfo[name]) return
            this.editCheck[`${name}Edit`] = true;
            this[name] = this.operatorInfo[name];

            this.$nextTick(() => {
                this.$refs[`${name}Input`].focus();
            })
        },
        handleBlur(name) {
            this.editCheck[`${name}Edit`] = false;
        },
        handleSave() {
            if (this.currentUser.authority < 6) {
                this.showDialog = true;
            } else {
                this.uploadChange();
            }
        },
        uploadChange() {
            if (this.uploading) return;
            const newInfo = {
                id: this.id || this.operatorInfo.id,
                sex: this.operatorInfo.sex,
                combatExperience: this.combatExperience || this.operatorInfo.combatExperience,
                birthplace: this.birthplace || this.operatorInfo.birthplace,
                birthday: this.birthday || this.operatorInfo.birthday,
                height: this.height || this.operatorInfo.height,
                race: this.race || this.operatorInfo.race,
                profession: this.profession || this.operatorInfo.profession,
                organization: this.organization || this.operatorInfo.organization,
                oripathyInfectionStatus: this.oripathyInfectionStatus || this.operatorInfo.oripathyInfectionStatus,
            }
            const uploadButton = this.$refs.uploadButton;
            uploadButton.classList.add('upload-button-disabled')
            this.uploading = true;
            this.sendRequest(
                {
                    method: 'POST',
                    url: '/info/changeInfo',
                    data: newInfo
                }
            ).then(
                ({ data }) => {
                    if (data.state === 'success') {
                        uploadButton.classList.remove('upload-button-disabled')
                        this.uploading = false;
                        if (!this.id) {
                            this.handleCookie('operatorInfo', newInfo);
                            this.clear();
                            this.init();
                            this.showUpload = false
                        } else {
                            this.clear();
                            this.init();
                            this.showUpload = false
                        }
                    }
                }
            )

        },
        handleCookie(cookieName, cookieValue) {
            const nowStampSecond = Date.now() / 1000;
            const timeStampSecond = parseInt(this[cookieName].timeStamp) / 1000;
            const maxAge = parseInt(this.$cookies.get(`__maxage_${cookieName}`));
            const remainingMaxage = Math.ceil(maxAge - (nowStampSecond - timeStampSecond));
            this.setCookie(cookieName, { ...cookieValue, timeStamp: timeStampSecond * 1000 }, remainingMaxage);
            this.setCookie(`__maxage_${cookieName}`, maxAge, remainingMaxage)
        }
    },

    watch: {
        combatExperience(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.combatExperience) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        birthplace(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.birthplace) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        birthday(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.birthday) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        height(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.height) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        race(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.race) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        profession(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.profession) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        organization(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.organization) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        oripathyInfectionStatus(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorInfo.oripathyInfectionStatus) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        }
    },
    activated() {
        this.init();
    },
}
</script>

<style lang="less" scoped>
.container {
    height: 540px;
    margin: 0 200px 0 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c9cbd0;

    .avatar {
        width: 300px;
        height: 300px;
        margin-right: 400px;
    }

    .content {
        display: flex;
        flex-direction: column;

        .info {
            width: 230px;
            font-size: 20px;
            margin-top: 20px;
            display: flex;

            &:hover {
                background-color: #2b2b2b;
                cursor: pointer;
            }

            input {
                width: 60px;
            }
        }

        & .info:first-child:hover {
            background-color: #353535;
            cursor: not-allowed;
        }
    }

    .upload {
        position: absolute;
        bottom: 20px;

        .upload-button {
            width: 400px;
            height: 40px;
            background-color: #404040;
            border: 1px solid #c9cbd0;
            color: #c9cbd0;
            cursor: pointer;
        }

        .upload-button-disabled {
            color: #616061;
            border: 1px solid #616061;
            cursor: not-allowed;
        }
    }

    .dialog {
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

        .dialog-container {
            width: 500px;
            height: 200px;
            background-color: #404040;
            box-shadow: 5px 5px 5px #232323;
            color: #c9cbd0;
            text-align: center;

            .text-box {
                height: 100px;
                line-height: 150px;
                font-size: 17px;

                span {
                    font-weight: bolder;
                    color: orangered;
                }
            }

            .button-box {
                height: 100px;
                display: flex;
                justify-content: space-around;
                align-items: center;

                .button {
                    width: 200px;
                    height: 40px;
                    line-height: 40px;
                    background-color: #2b2b2b;
                    border: 1px solid #c9cbd0;
                    color: #c9cbd0;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>