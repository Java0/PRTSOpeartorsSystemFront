<template>
    <div class="avatar-container">
        <div class="avatar-selector">
            <div class="selector-window">
                +
            </div>
            <img class="avatar-img" :src="pickedAvatarBase64 ? pickedAvatarBase64 : inputAvatar" alt="avatar"
                v-if="inputAvatar || pickedAvatarBase64">
            <form class="avatar-form" ref="avatarForm">
                <input type="file" class="avatar-input" @change="selectFile($event)" ref="avatarIn">
            </form>
        </div>

        <div class="cropper-box" v-if="showCropperDialog">
            <div class="cropper-background">
                <div class="top">
                    <div class="back" @click="backToSelector">←</div>
                    <div class="close" @click="closeCropper">x</div>
                </div>
                <div class="title">编辑头像</div>
                <VueCropper ref="cropper" class="cropper" :img="avatarBase64" :fixedBox="true" :autoCrop="true"
                    autoCropWidth="300" autoCropHeight="300" outputType="png" :canMoveBox="false" />
                <div class="save">
                    <button class="save-button" @click="getPickAvatar">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
import { mapState } from 'vuex';
import { dealImage } from '@/utils/compressor'
export default {
    name: 'AvatarUploader',
    components: {
        VueCropper
    },
    props: {
        inputAvatar: {
            required: false
        }
    },
    data() {
        return {
            showCropperDialog: false,
            avatarBase64: '',
            pickedAvatarBase64: null
        }
    },
    computed: {
        ...mapState(['isLogined'])
    },
    methods: {
        selectFile(e) {
            const file = e.target.files[0];
            if (!file) return
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                var imgcode = e.target.result;
                this.avatarBase64 = imgcode
                this.showCropperDialog = true;
            }
        },

        closeCropper() {
            this.showCropperDialog = false;
            this.$refs.avatarForm.reset();
        },
        backToSelector() {
            this.showCropperDialog = false;
            this.$refs.avatarIn.click();
        },

        getPickAvatar() {
            this.$refs.cropper.getCropData(data => {
                this.pickedAvatarBase64 = data;

                dealImage('compressedAvatar', data, 100, (compressedAvatar) => {
                    this.$bus.$emit('getAvatarFromUploader', {
                        avatar: data.toString('base64'),
                        compressedAvatar: compressedAvatar.value
                    });


                    if (this.isLogined) {
                        this.$bus.$emit('getNewAvatar', {
                            avatar: data.toString('base64'),
                            compressedAvatar: compressedAvatar.value
                        });
                    }
                })

            });
            this.$refs.avatarForm.reset();
            this.showCropperDialog = false;
        },

        clickAvatarIn() {
            this.$refs.avatarIn.click();
        }

    },
}
</script>

<style scoped lang="less">
.avatar-container {
    color: #c9cbd0;
    .avatar-selector {
        width: 200px;
        height: 200px;
        box-shadow: inset -1px 3px 3px #232323;
        background-color: #404040;
        position: relative;

        .selector-window {
            width: 200px;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 50px;
        }

        .avatar-img {
            width: 200px;
            height: 200px;
            position: absolute;
            top: 0;
        }

        .avatar-form {
            width: 200px;
            height: 200px;
            position: absolute;
            top: 0;
            opacity: 0;

            .avatar-input {
                width: 200px;
                height: 200px;
                cursor: pointer;
            }
        }
    }

    .cropper-box {
        background-color: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        .cropper-background {
            width: 600px;
            height: 650px;
            background-color: #404040;
            box-shadow: 5px 5px 5px #232323;

            .top {
                font-weight: bold;
                padding: 10px 20px 0 20px;
                box-sizing: border-box;
                overflow: hidden;

                .back {
                    font-size: 20px;
                    cursor: pointer;
                    float: left;

                    &:hover {
                        color: #22bbff;
                    }
                }

                .close {
                    font-size: 20px;
                    cursor: pointer;
                    float: right;

                    &:hover {
                        color: #22bbff;
                    }
                }

            }

            .title {
                height: 60px;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                line-height: 40px;

            }

            .cropper {
                width: 500px;
                height: 500px;
                margin: 0 auto;
            }

            .save {

                height: 70px;
                text-align: center;
                line-height: 70px;

                .save-button {
                    width: 100px;
                    height: 40px;
                    background-color: #404040;
                    border: 1px solid #c9cbd0;
                    color: #c9cbd0;
                    cursor: pointer;
                }
            }

        }
    }
}
</style>