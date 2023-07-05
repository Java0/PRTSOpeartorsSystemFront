<template>
  <div class="container">
    <div class="back">
      <div class="button" @click="back">←</div>
    </div>
    <div class="search-bar">
      <img src="../../assets/icon/serch_icon.png" alt="" class="search-icon">
      <div class="search-info">
        <div class="search-type" v-if="searchType">
          <div>{{ searchType }}</div>
          <div class="clear" @click="clear">x</div>
        </div>
        <div class="text" v-else @click="showSearchMenu">检索</div>
      </div>
    </div>
    <div class="operator-list">
      <div v-for="(number, index) of 5" :key="calcIndex(index)"
        :class="calcIndex(index) % 2 == 0 ? 'item item-dark' : 'item'">
        <div class="content" v-if="operatorList[calcIndex(index)]">
          <div class="avatar-box">
            <img class="avatar" :src="operatorList[calcIndex(index)].compressedAvatar" alt="">
            <div class="authority-box">
              <img src="../../assets/Star.png" alt="" class="star"
                v-for="index of operatorList[calcIndex(index)].authority" :key="index" :style="`left: ${9 * index}px`">
            </div>
          </div>
          <div class="info">
            <div>【序列-ID】：{{ `${operatorList[calcIndex(index)].order} - ${operatorList[calcIndex(index)].id}` }}</div>
            <div>【代号】：{{ operatorList[calcIndex(index)].name }}</div>
            <div>【性别】：{{ operatorList[calcIndex(index)].sex }}</div>
          </div>
          <div class="info">
            <div>【出生地】：{{ operatorList[calcIndex(index)].birthplace }}</div>
            <div>【出生日期】：{{ operatorList[calcIndex(index)].birthday }}</div>
            <div>【矿石病感染情况】：{{ operatorList[calcIndex(index)].oripathyInfectionStatus }}</div>
          </div>
          <div class="info">
            <div>【种族】：{{ operatorList[calcIndex(index)].race }}</div>
            <div>【现属组织】：{{ operatorList[calcIndex(index)].organization }}</div>
            <div>【职业】：{{ operatorList[calcIndex(index)].profession }}</div>
          </div>
          <div class="routers">
            <div class="link">
              <router-link
                :to="{ name: 'managePersonalCenter', query: { id: operatorList[calcIndex(index)].id, name: operatorList[calcIndex(index)].name, routeName: 'manageAccountInfo' } }"
                active-class="active-class">
                账号信息
              </router-link>
            </div>
            <div class="link">
              <router-link
                :to="{ name: 'managePersonalCenter', query: { id: operatorList[calcIndex(index)].id, name: operatorList[calcIndex(index)].name, routeName: 'managePersonalInfo' } }"
                active-class="active-class">
                个人信息
              </router-link>
            </div>
            <div class="link">
              <router-link
                :to="{ name: 'managePersonalCenter', query: { id: operatorList[calcIndex(index)].id, name: operatorList[calcIndex(index)].name, routeName: 'manageExamInfo' } }"
                active-class="active-class">
                体检测试
              </router-link>
            </div>
            <div class="link">
              <router-link
                :to="{ name: 'managePersonalCenter', query: { id: operatorList[calcIndex(index)].id, name: operatorList[calcIndex(index)].name, routeName: 'manageArchivesInfo' } }"
                active-class="active-class">
                档案信息
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-controller">
      <div :class="this.currentPage != 1 ? 'switch' : 'switch switch-disabled'" @click="prevPage">上一页</div>
      <div class="page-view">{{ currentPage }} / {{ pagesCount }}</div>
      <div :class="this.currentPage != this.pagesCount ? 'switch' : 'switch switch-disabled'" @click="nextPage">下一页</div>

    </div>
    <Search />
  </div>
</template>

<script>
import AxiosMixin from '@/mixins/AxiosMixin'
import Search from './Search.vue';
export default {
  name: 'OperatorList',
  mixins: [AxiosMixin],
  components: {
    Search
  },
  data() {
    return {
      operatorsCount: 0,
      queryCount: 5,
      operatorList: [],
      currentPage: 1,
      maxPage: 1,
      searchType: ''
    }
  },
  computed: {
    pagesCount() {
      return Math.ceil(this.operatorsCount / this.queryCount);
    }
  },
  methods: {
    back() {
      this.$router.push({name: 'homePage'})
    },
    clear() {
      this.operatorList = [];
      this.getOperatorsCount();
      this.getOperatorList(1);
      this.currentPage = 1;
      this.maxPage = 1;
      this.searchType = '';
    },
    prevPage() {
      if (this.currentPage == 1) return;
      this.currentPage--;
    },
    nextPage() {
      if (this.currentPage == this.pagesCount) return;

      const nextPage = this.currentPage + 1;
      if (nextPage > this.maxPage && this.operatorList.length != this.operatorsCount) {
        this.maxPage = nextPage;
        this.getOperatorList(nextPage);
      }

      this.currentPage++;

    },
    calcIndex(index) {
      return (this.queryCount * (this.currentPage - 1)) + index;
    },
    getOperatorList(page) {
      this.sendRequest(
        {
          method: 'GET',
          url: '/manage/getOperatorList',
          params: {
            currentPage: page,
            count: this.queryCount
          }
        }
      ).then(({ data }) => {
        this.operatorList.push(...data);
      })
    },
    getOperatorsCount() {
      this.sendRequest(
        {
          method: 'GET',
          url: '/account/getAccountsCount',
        }
      ).then(({ data }) => {
        this.operatorsCount = data;
      })
    },
    showSearchMenu() {
      this.$bus.$emit('showSearchMenu');
    }
  },
  mounted() {
    this.getOperatorsCount();
    this.getOperatorList(1);

    this.$bus.$on('getSearchResult', (searchResult) => {
      const resultList = searchResult.resultList;
      this.operatorsCount = resultList.length;
      this.operatorList = resultList;
      this.searchType = searchResult.searchType;
    })

  }
}
</script>

<style lang="less" scoped>
.container {
  height: 540px;
  margin: 0 200px 0 100px;
  position: relative;
  color: #c9cbd0;

  .back {
    position: absolute;
    top: -35px;
    left: 10px;

    .button {
      font-size: 30px;
      font-weight: bolder;
      cursor: pointer;

      &:hover {
        color: #22bbff;
      }
    }
  }

  .search-bar {
    display: flex;
    position: absolute;
    top: -30px;
    right: 10px;

    .search-info {
      font-size: 20px;
      font-weight: bolder;

      .search-type {
        display: flex;

        .clear {
          margin-left: 5px;
          cursor: pointer;
          font-size: 12px;
          color: #22bbff;

          &:hover {
            color: orangered
          }
        }
      }

      .text {
        cursor: pointer;

        &:hover {
          color: #22bbff
        }
      }


    }
  }

  .operator-list {
    height: 520px;
    display: flex;
    flex-direction: column;

    .item {
      .content {
        height: 100px;
        display: flex;
        justify-content: space-evenly;
        padding: 2px 0;
        box-sizing: border-box;
        margin-bottom: 5px;
        box-sizing: border-box;

        .avatar-box {
          height: 95px;
          width: 95px;
          position: relative;

          .avatar {
            height: 95px;
            width: 95px;
          }

          .authority-box {
            position: absolute;
            top: 10px;
            right: 10px;

            .star {
              width: 15px;
              position: absolute;
            }
          }

        }

        .info {
          width: 300px;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .routers {
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .link {
            font-size: 20px;
            font-weight: bolder;

            a {
              font-size: 15px;
              color: #c9cbd0;

              &:hover {
                color: #22bbff
              }
            }
          }
        }

      }
    }

    .item-dark {
      background-color: #2b2b2b;
      box-shadow: 5px 5px 5px #000;
      border-bottom: 0;
    }
  }

  .page-controller {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;

    .page-view {
      margin: 0 40px;
    }

    .switch {
      font-size: 18px;
      font-weight: bolder;
      cursor: pointer;

      &:hover {
        color: #22bbff
      }
    }

    .switch-disabled {
      color: #797979;

      &:hover {
        color: #797979;
      }
    }

  }



}
</style>