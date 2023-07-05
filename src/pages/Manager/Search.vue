<template>
    <div class="background" v-show="show">
        <div class="content">
            <div class="close" @click="() => { this.show = false }">x</div>
            <div class="name-box">
                <div class="text">代号：</div>
                <input type="text" v-model="name">
            </div>
            <div class="separator">or</div>
            <div class="profession-box">
                <div class="item">
                    <input type="radio" value="先锋" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">先锋</div>
                    <img src="../../assets//profession/先锋.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="近卫" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">近卫</div>
                    <img src="../../assets//profession/近卫.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="重装" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">重装</div>
                    <img src="../../assets//profession/重装.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="狙击" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">狙击</div>
                    <img src="../../assets//profession/狙击.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="术士" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">术士</div>
                    <img src="../../assets//profession/术士.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="医疗" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">医疗</div>
                    <img src="../../assets//profession/医疗.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="辅助" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">辅助</div>
                    <img src="../../assets//profession/辅助.png" alt="">
                </div>
                <div class="item">
                    <input type="radio" value="特种" name="profession" v-model="profession" @change="() => { this.name = '' }"
                        class="radio">
                    <div class="text">特种</div>
                    <img src="../../assets//profession/特种.png" alt="">
                </div>
            </div>
            <div class="button-box">
                <div class="button" @click="search">开始检索</div>
            </div>
        </div>
    </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin';
export default {
    name: 'Search',
    mixins: [AxiosMixin],
    data() {
        return {
            show: false,
            name: '',
            profession: '',
        }
    },
    methods: {
        search() {
            if (this.name) {
                this.getOperatorListByName(this.name);
                this.name = '';
            }
            if (this.profession) {
                this.getOperatorListByProfession(this.profession);
                this.profession = '';
            }
        },
        getOperatorListByName(name) {
            this.sendRequest({
                method: 'GET',
                url: '/manage/getOperatorListByName',
                params: {
                    name
                }
            }).then(({ data }) => {
                this.$bus.$emit('getSearchResult', {
                    resultList: data,
                    searchType: `代号：${name}`
                })
                this.show = false;
            })
        },
        getOperatorListByProfession(profession) {
            this.sendRequest({
                method: 'GET',
                url: '/manage/getOperatorListByProfession',
                params: {
                    profession
                }
            }).then(({ data }) => {
                this.$bus.$emit('getSearchResult', {
                    resultList: data,
                    searchType: `职业：${profession}`
                })
                this.show = false;
            })
        }
    },
    mounted() {
        this.$bus.$on('showSearchMenu', () => {
            this.show = true;
        })
    }
}
</script>

<style lang="less" scoped>
.background {
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


    .content {
        width: 1000px;
        height: 400px;
        background-color: #404040;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;

        .close {
            font-size: 25px;
            align-self: flex-start;
            margin-left: 20px;
            cursor: pointer;

            &:hover {
                color: #22bbff;
            }
        }

        .name-box {
            height: 100px;
            display: flex;
            font-size: 25px;
            align-items: center;

            input {
                left: 0;
                height: 30px;
                background-color: #404040 !important;
                color: #c9cbd0;
                box-shadow: 0 3px 0 #232323;
                border: 0;
                padding-left: 15px;
                box-sizing: border-box;
            }
        }

        .separator {
            height: 50px;
            font-size: 25px;
            color: #22bbff
        }


        .profession-box {
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: space-evenly;
            align-items: center;

            .item {
                width: 120px;
                font-size: 25px;
                display: flex;
                justify-content: center;
                align-items: center;

                input[type="radio"] {
                    appearance: none;
                    position: relative;
                    width: 13px;
                    height: 13px;
                    margin-right: 10px;
                    border: 1px solid #c9cbd0;
                    box-sizing: border-box;
                    cursor: pointer;

                    &:checked::before {
                        content: "";
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        background: #fff;
                        box-shadow: 0px 0px 5px 1px #fff;
                    }
                }


                img {
                    width: 30px;
                }
            }
        }

        .button-box {
            height: 100px;
            display: flex;
            align-items: center;
            color: #c9cbd0;
            .button {
                width: 200px;
                height: 40px;
                text-align: center;
                line-height: 40px;
                background-color: #2b2b2b;
                border: 1px solid #c9cbd0;
                cursor: pointer;
            }
        }

    }

}
</style>
