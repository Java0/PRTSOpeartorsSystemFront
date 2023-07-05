<template>
    <div class="container">
        <img :src="avatar" alt="" class="avatar">
        <div class="content" v-if="operatorExam">
            <div class="info" @click="handleClick('physicalStrength')">
                <div class="key">物理强度：</div>
                <input type="text" v-if="editCheck.physicalStrengthEdit" v-model.lazy="physicalStrength"
                    @blur="handleBlur('physicalStrength')" ref="physicalStrengthInput">
                <div class="value" v-else>{{ physicalStrength || operatorExam.physicalStrength || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('battlefieldMobility')">
                <div class="key">战场机动：</div>
                <input type="text" v-if="editCheck.battlefieldMobilityEdit" v-model.lazy="battlefieldMobility"
                    @blur="handleBlur('battlefieldMobility')" ref="battlefieldMobilityInput">
                <div class="value" v-else>{{ battlefieldMobility || operatorExam.battlefieldMobility || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('physiology')">
                <div class="key">生理耐受：</div>
                <input type="text" v-if="editCheck.physiologyEdit" v-model.lazy="physiology"
                    @blur="handleBlur('physiology')" ref="physiologyInput">
                <div class="value" v-else>{{ physiology || operatorExam.physiology || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('tacticalPlanning')">
                <div class="key">战术规划：</div>
                <input type="text" v-if="editCheck.tacticalPlanningEdit" v-model.lazy="tacticalPlanning"
                    @blur="handleBlur('tacticalPlanning')" ref="tacticalPlanningInput">
                <div class="value" v-else>{{ tacticalPlanning || operatorExam.tacticalPlanning || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('combatSkills')">
                <div class="key">战斗技巧：</div>
                <input type="text" v-if="editCheck.combatSkillsEdit" v-model.lazy="combatSkills"
                    @blur="handleBlur('combatSkills')" ref="combatSkillsInput">
                <div class="value" v-else>{{ combatSkills || operatorExam.combatSkills || defaultText }}</div>
            </div>
            <div class="info" @click="handleClick('originiumArtsAdaptability')">
                <div class="key">源石技艺适应性：</div>
                <input type="text" v-if="editCheck.originiumArtsAdaptabilityEdit" v-model.lazy="originiumArtsAdaptability"
                    @blur="handleBlur('originiumArtsAdaptability')" ref="originiumArtsAdaptabilityInput">
                <div class="value" v-else>{{ originiumArtsAdaptability || operatorExam.originiumArtsAdaptability ||
                    defaultText
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
            operatorExam: null,
            physicalStrength: '',
            battlefieldMobility: '',
            physiology: '',
            tacticalPlanning: '',
            combatSkills: '',
            originiumArtsAdaptability: '',
            editCheck: {
                physicalStrengthEdit: false,
                battlefieldMobilityEdit: false,
                physiologyEdit: false,
                tacticalPlanningEdit: false,
                combatSkillsEdit: false,
                originiumArtsAdaptabilityEdit: false,
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
                this.operatorExam = this.$cookies.get('operatorExam')
                this.avatar = localStorage.getItem("operatorAvatar");
            } else {
                this.sendRequest({
                    method: 'GET',
                    url: '/info/getOperatorExam',
                    params: {
                        id: id
                    }
                }).then(({ data }) => {
                    this.operatorExam = data;
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
            this.physicalStrength = '';
            this.battlefieldMobility = '';
            this.physiology = '';
            this.tacticalPlanning = '';
            this.combatSkills = '';
            this.originiumArtsAdaptability = '';
        },
        handleClick(name) {
            if (this.currentUser.authority < 6 && this.operatorExam[name]) return
            this.editCheck[`${name}Edit`] = true;
            this[name] = this.operatorExam[name];
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
            const newExam = {
                id: this.id || this.operatorExam.id,
                physicalStrength: this.physicalStrength || this.operatorExam.physicalStrength,
                battlefieldMobility: this.battlefieldMobility || this.operatorExam.battlefieldMobility,
                physiology: this.physiology || this.operatorExam.physiology,
                tacticalPlanning: this.tacticalPlanning || this.operatorExam.tacticalPlanning,
                combatSkills: this.combatSkills || this.operatorExam.combatSkills,
                originiumArtsAdaptability: this.originiumArtsAdaptability || this.operatorExam.originiumArtsAdaptability,
            }
            const uploadButton = this.$refs.uploadButton;
            uploadButton.classList.add('upload-button-disabled')
            this.uploading = true;
            this.sendRequest(
                {
                    method: 'POST',
                    url: '/info/changeExam',
                    data: newExam
                }
            ).then(
                ({ data }) => {
                    if (data.state === 'success') {
                        uploadButton.classList.remove('upload-button-disabled')
                        this.uploading = false;
                        if (!this.id) {
                            this.handleCookie('operatorExam', newExam)
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
        physicalStrength(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.physicalStrength) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },

        battlefieldMobility(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.battlefieldMobility) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        physiology(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.physiology) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        tacticalPlanning(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.tacticalPlanning) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        combatSkills(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.combatSkills) {
                this.showUpload = true;
            } else {
                this.showUpload = false;
            }
        },
        originiumArtsAdaptability(newValue) {
            if (!newValue) return;
            if (newValue !== this.operatorExam.originiumArtsAdaptability) {
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