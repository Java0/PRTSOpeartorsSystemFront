<template>
    <div class="container">
        <div class="title-editor" v-if="newArchives">
            <div class="button-box">
                <div class="button-box-text">档案资料【{{ operatorName }}】</div>
                <div class="button" @click="addButtonClick">+</div>
            </div>
            <div class="title-box">
                <div class="title" v-for="(archive, index) in newArchives" :key="index" @click="titleClick($event, index)"
                    :ref="`title${index}`">
                    <div class="title-text" v-if="archive.title">{{ archive.title }}</div>
                </div>
                <input type="text" class="title-input" v-model.lazy="newTitle" v-if="titleEditing" ref="titleInput"
                    @blur="addArchive" @keypress.enter="addArchive">
            </div>

        </div>

        <div class="content" v-if="newArchives">
            <div class="content-text" v-html="clickedText" v-if="clickedText"></div>
            <div class="text-editor" v-show="contentEditing">
                <div class="title">
                    <input type="text" class="title-editor" v-model="newTitle" placeholder="标题">
                </div>
                <textarea name="" id="" cols="30" rows="10" v-model="newContent" ref="contentInput"
                    placeholder="档案内容"></textarea>
                <div class="save">
                    <button class="save-button" ref="saveButton" @click="saveChange">保存修改</button>
                </div>
            </div>
        </div>
        <div class="upload">
            <button class="upload-button" v-if="showUpload" ref="uploadButton" @click="handleSave">上传修改</button>
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
import { mapState } from 'vuex';
export default {
    name: 'ArchivesInfo',
    mixins: [AxiosMixin],
    props: ['id', 'name'],
    data() {
        return {
            operatorArchives: null,
            newArchives: null,
            operatorName: '',
            order: 1,
            showUpload: false,
            titleEditing: false,
            contentEditing: false,
            editingIndex: '',
            clickedIndex: '',
            newTitle: '',
            newContent: '',
            lastClickedTitle: null,
            clickedText: '',
            uploading: false,
            showDialog: false
        }
    },
    methods: {
        init() {
            const id = this.id;
            const name = this.name;
            this.operatorArchives = null;
            this.newArchives = null;

            if (!id) {
                this.operatorArchives = JSON.parse(localStorage.getItem('operatorArchives'));
                this.newArchives = JSON.parse(localStorage.getItem('operatorArchives'));
                this.operatorName = this.currentUser.name;
            } else {
                this.operatorName = name;
                this.sendRequest({
                    method: 'GET',
                    url: '/info/getAllArchive',
                    params: {
                        id: id
                    }
                }).then(({ data }) => {
                    this.operatorArchives = data;
                    this.newArchives = this._.cloneDeep(data);

                    if (this.newArchives[0].title) {
                        this.$nextTick(() => {
                            if (this.newArchives[0].title) {
                                this.$nextTick(() => {
                                    this.$refs.title0[0].click();
                                })
                            }
                        })
                    }

                })
            }
        },
        clearArchives() {
            this.operatorArchives = null;
            this.newArchives = null;
        },
        clear() {
            if (this.newTitle) {
                this.newTitle = '';
            }
            if (this.newContent) {
                this.newContent = '';
            }
        },
        titleClick(e, index) {
            if (this.contentEditing) return;

            this.clickedIndex = index;

            const target = e.target;

            if (target === this.lastClickedTitle) {
                this.edit(index)
                return;
            }

            target.classList.add('title-clicked');
            if (this.lastClickedTitle) {
                this.lastClickedTitle.classList.remove('title-clicked')
            }
            this.lastClickedTitle = target;

            const text = this.newArchives[index].text;
            if (text) {
                this.clickedText = this.handleText(text);
            } else {
                this.edit(index)
            }

        },

        edit(index) {
            if (this.currentUser.authority < 6 && this.operatorArchives[index] && this.operatorArchives[0].text) return;

            this.contentEditing = true;
            this.showUpload = false;
            this.editingIndex = index;
            this.newTitle = this.newArchives[index].title;
            this.newContent = this.newArchives[index].text;
            this.clickedText = ''
            this.$nextTick(() => {
                this.$refs.contentInput.focus()
            });
        },

        addButtonClick() {
            if (this.contentEditing) return;
            this.clear();
            this.titleEditing = true;
            this.$nextTick(() => {
                this.$refs.titleInput.focus();
            });
        },
        addArchive() {
            if (!this.newTitle) {
                this.titleEditing = false;
                return;
            }
            if (!this.newArchives[0].title) {
                this.$set(this.newArchives[0], 'title', this.newTitle);
                const title = this.$refs.title0[0];
                this.$nextTick(() => {
                    title.click();
                    this.titleEditing = false;
                })
            } else {
                this.order++;
                this.newArchives.push({
                    id: this.newArchives[0].id,
                    title: this.newTitle,
                    order: this.order
                })
                this.$nextTick(() => {
                    const title = this.$refs[`title${this.newArchives.length - 1}`][0];
                    title.click();
                    this.titleEditing = false;
                })
            }
            this.clickedText = '';
        },
        saveChange() {
            if (!this.newContent || !this.newTitle) return
            this.$set(this.newArchives[this.editingIndex], 'title', this.newTitle);
            this.$set(this.newArchives[this.editingIndex], 'text', this.newContent);
            this.contentEditing = false;
            this.clickedText = this.handleText(this.newContent);
            if (this.editingIndex > this.operatorArchives.length - 1) {
                this.showUpload = true;
            } else if (!this.operatorArchives[this.editingIndex].title || !this.operatorArchives[this.editingIndex].text) {
                this.showUpload = true;
            } else {
                const archive = this.operatorArchives[this.editingIndex];
                const newArchive = this.newArchives[this.editingIndex];
                if (newArchive.title !== archive.title || newArchive.text !== archive.text) {
                    this.showUpload = true;
                } else {
                    this.showUpload = false;
                }
            }
        },
        handleSave() {
            if (this.currentUser.authority < 6) {
                this.showDialog = true;
            } else {
                this.uploadChange();
            }
        },
        uploadChange() {
            const uploadButton = this.$refs.uploadButton;
            uploadButton.classList.add('upload-button-disabled')
            this.uploading = true;
            this.sendRequest(
                {
                    method: "POST",
                    url: '/info/changeArchives',
                    data: this.newArchives
                }
            ).then(
                ({ data }) => {
                    if (data.state === 'success') {
                        uploadButton.classList.remove('upload-button-disabled')
                        this.uploading = false;
                        if (!this.id) {
                            localStorage.setItem('operatorArchives', JSON.stringify(this.newArchives));
                            this.clearArchives();
                            this.init();
                            this.showUpload = false
                        } else {
                            this.clearArchives();
                            this.init();
                            this.showUpload = false
                        }

                    }
                }
            )
        },

        handleText(text) {
            const splitedText = text.split(`\n`);
            let newText = '';
            splitedText.forEach(ele => {
                newText += `<p>${ele}</p>`
            })
            return newText;
        }
    },
    computed: {
        ...mapState(['currentUser'])
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
    display: flex;
    justify-content: center;
    color: #c9cbd0;
    position: relative;

    .title-editor {
        width: 400px;
        height: 540px;
        margin-right: 200px;

        .button-box {
            height: 50px;
            display: flex;
            align-items: center;
            border-bottom: 3px solid #c9cbd0;
            box-sizing: border-box;

            div {
                margin-left: 10px;
            }

            .button-box-text {
                letter-spacing: 1px;
                font-size: 20px;
                font-weight: bolder;
            }

            .button {
                width: 20px;
                height: 20px;
                background-color: #22bbff;
                border-radius: 5px;
                text-align: center;
                line-height: 20px;
                font-weight: bolder;
                cursor: pointer;

                &:hover {
                    background-color: #00adf7;
                }
            }
        }

        .title-box {
            height: 490px;
            overflow-y: auto;
            overflow-x: hidden;

            .title {
                line-height: 70px;
                font-size: 20px;
                cursor: pointer;

                &:hover {
                    background-color: #2b2b2b;
                }

                .title-text {
                    height: 70px;
                    padding-left: 10px;
                    letter-spacing: 2px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                    box-sizing: border-box;
                }
            }

            .title-clicked {
                background-color: #2b2b2b;
            }

            .title-input {
                width: 400px;
                height: 40px;
                padding-left: 5px;
                background-color: #404040;
                color: #c9cbd0;
                box-shadow: inset 1px 3px 3px #232323;
                border: 0;
                box-sizing: border-box;
            }
        }


    }

    .content {
        width: 400px;
        height: 540px;

        .content-text {
            height: 540px;
            overflow-y: auto;
            font-size: 17px;
            letter-spacing: 4px;

            &::-webkit-scrollbar {
                width: 5px;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #22bbff;
                border-radius: 3px;
            }

            &::-webkit-scrollbar-track {
                margin-top: 10px;
            }
        }

        .text-editor {
            .title {
                height: 50px;
                border-bottom: 3px solid #c9cbd0;
                box-sizing: border-box;
                line-height: 50px;

                .title-editor {
                    width: 400px;
                    height: 30px;
                    padding-left: 5px;
                    background-color: #404040;
                    color: #c9cbd0;
                    box-shadow: inset 1px 3px 3px #232323;
                    border: 0;
                    box-sizing: border-box;
                }
            }

            textarea {
                width: 400px;
                height: 420px;
                margin: 10px 0 20px 0;
                resize: none;
                background-color: #404040;
                color: #c9cbd0;
                box-shadow: inset 3px 5px 5px #232323;
                border: 0;
                box-sizing: border-box;
            }

            .save {
                .save-button {
                    width: 400px;
                    height: 40px;
                    background-color: #404040;
                    border: 1px solid #c9cbd0;
                    color: #c9cbd0;
                    cursor: pointer;
                    box-sizing: border-box;
                }

            }

        }
    }

    .upload {
        position: absolute;
        top: 580px;

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
}</style>