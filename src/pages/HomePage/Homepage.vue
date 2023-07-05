<template>
  <div class="container" ref="logInfoContainer">
    <div class="sign" v-if="this.operatorInfo">
      <img :src="avatarBase64" alt="" v-if="avatarBase64" class="avatar">
      <div class="name">{{ currentUser.name }} <img :src="require(`../../assets/profession/${operatorInfo.profession}.png`)" alt="" class="profession" v-if="operatorInfo.profession"></div>

      <div class="authority">
        <img src="../../assets/Star.png" alt="" class="star" v-for="index of this.currentUser.authority" :key="index"
          :style="`left: ${20 * index}px`">
      </div>
    </div>

    <div class="archive">
      <div v-if="this.operatorInfo">
        <div class="title">基础档案</div>
        <div class="info order">
          <div class="key">序列-ID</div>
          <div class="value">{{ `${currentUser.order}_${currentUser.id}` }}</div>
        </div>

        <div class="info sex">
          <div class="key">性别</div>
          <div class="value">{{ operatorInfo.sex }}</div>
        </div>
        <div class="info combat-experience">
          <div class="key">战斗经验</div>
          <div class="value">{{ operatorInfo.combatExperience || defaultText }}</div>
        </div>
        <div class="info birthplace">
          <div class="key">出生地</div>
          <div class="value">{{ operatorInfo.birthplace || defaultText }}</div>
        </div>
        <div class="info birthday">
          <div class="key">出生日期</div>
          <div class="value">{{ operatorInfo.birthday || defaultText }}</div>
        </div>
        <div class="info height">
          <div class="key">身高</div>
          <div class="value">{{ operatorInfo.height || defaultText }}<span v-if="operatorInfo.height">cm</span></div>
        </div>
        <div class="info race">
          <div class="key">种族</div>
          <div class="value">{{ operatorInfo.race || defaultText }}</div>
        </div>
        <div class="info oripathy-infection-status">
          <div class="key">矿石病感染情况</div>
          <div class="value">{{ operatorInfo.oripathyInfectionStatus || defaultText }}</div>
        </div>
      </div>

      <div v-if="this.operatorExam">
        <div class="title">综合体检测试</div>
        <div class="info physical-strength">
          <div class="key">物理强度</div>
          <div class="value">{{ operatorExam.physicalStrength || defaultText }}</div>
        </div>
        <div class="info battlefield-mobility">
          <div class="key">战场机动</div>
          <div class="value">{{ operatorExam.battlefieldMobility || defaultText }}</div>
        </div>
        <div class="info physiology">
          <div class="key">生理耐受</div>
          <div class="value">{{ operatorExam.physiology || defaultText }}</div>
        </div>
        <div class="info tactical-planning">
          <div class="key">战术规划</div>
          <div class="value">{{ operatorExam.tacticalPlanning || defaultText }}</div>
        </div>
        <div class="info combat-skills">
          <div class="key">战斗技巧</div>
          <div class="value">{{ operatorExam.combatSkills || defaultText }}</div>
        </div>
        <div class="info originium-arts-adaptability">
          <div class="key">源石技艺适应性</div>
          <div class="value">{{ operatorExam.originiumArtsAdaptability || defaultText }}</div>
        </div>
      </div>
    </div>

    <div class="archive-info" v-if="this.operatorArchives">
      <div v-for="(archive, index) in this.operatorArchives" :key="index">
        <div class="title">{{ archive.title }}</div>
        <div class="text" v-html="handledText[index]"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AxiosMixin from '@/mixins/AxiosMixin';
export default {
  name: 'Homepage',
  mixins: [AxiosMixin],
  data() {
    return {
      currentWidth: screen.width,
      currentHeight: screen.height,
      newSize: {
        newWidth: '',
        newHeight: '',
      },
      scaleRange: screen.height / 1080,
      operatorInfo: null,
      operatorExam: null,
      operatorArchives: null,
      handledText: [],
      avatarBase64: null,
      defaultText: '资料缺失，请尽快补全！'
    }
  },
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    scale() {
      const container = this.$refs.logInfoContainer;
      container.style.height = container.offsetHeight * this.scaleRange + 'px';
      for (let e of container.children) {
        this.changeSize(e.children);
      }
    },
    changeSize(elements) {
      for (let e of elements) {
        if (e.classList.contains('info') || e.classList.contains('star')) {
          this.changeSize(e.children);
        } else {
          e.style.marginTop = 10 * this.scaleRange + 'px';
          e.style.width = e.offsetWidth * this.scaleRange + 'px';
          e.style.height = e.offsetHeight * this.scaleRange + 'px';
          this.changeSize(e.children);
        }

      }
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
  watch: {
    newSize: {
      deep: true,
      handler(newValue) {
        if ((newValue.newWidth - this.currentWidth) >= 500 && (newValue.newHeight - this.currentHeight) >= 300) {
          this.scaleRange = newValue.newHeight / this.currentHeight;
          this.scale();
        }
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this._.debounce(
      () => {
        this.newSize.newHeight = screen.height;
        this.newSize.newWidth = screen.width;
      }
    ), 200)
    this.scale();

    this.avatarBase64 = localStorage.getItem('operatorAvatar');

    this.operatorInfo = this.$cookies.get('operatorInfo');
    this.operatorExam = this.$cookies.get('operatorExam');
    this.operatorArchives = JSON.parse(localStorage.getItem('operatorArchives'));
    this.operatorArchives.forEach(({ text }) => {
      if (text) {
        this.handledText.push(this.handleText(text));
      }
    })
  },
}
</script>



<style scoped lang="less">
.container {
  height: 540px;
  margin: 0 200px 0 100px;
  display: flex;
  justify-content: space-between;
  color: #c9cbd0;

  .basic() {
    background-color: #404040;
    border-radius: 5px;
    margin-top: 10px;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .sign {
    display: flex;
    flex-direction: column;
    align-content: space-between;

    .avatar {
      width: 408px;
      height: 408px;
      .basic();
      margin: 0;
      padding: 0;
    }

    .name {
      width: 308px;
      height: 51px;
      font-size: 30px;
      font-weight: bolder;
      display: flex;
      align-items: center;
      .basic()
    }

    .profession {
      width: 30px;
      margin-left: 10px;
    }

    .authority {
      width: 208px;
      height: 51px;
      position: relative;
      .basic();

      .star {
        width: 30px;
        height: 30px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }

    }

  }

  .archive {
    .title {
      width: 450px;
      height: 15px;
      font-size: 10px;
      line-height: 15px;
      .basic();
      color: #22bbff;
      padding-left: 5px;
    }

    .info {
      display: flex;
      justify-content: start;

      .key {
        width: 145px;
        height: 25px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        font-size: 14px;
        .basic();
        padding-left: 5px;

        &::before {
          content: '【'
        }

        ;

        &::after {
          content: '】';
        }
      }

      .value {
        width: 250px;
        height: 25px;
        display: flex;
        align-items: center;
        font-size: 14px;
        .basic();
        padding-left: 5px;
      }

    }

  }

  .archive-info {
    overflow-y: scroll;
    direction: rtl;
    display: flex;
    flex-direction: column;
    align-content: start;

    .title {
      width: 450px;
      height: 15px;
      font-size: 10px;
      line-height: 15px;
      .basic();
      color: #22bbff;
      padding-left: 5px;
      direction: ltr;
    }

    .text {
      width: 450px;
      .basic();
      padding-left: 5px;
      direction: ltr;
    }

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


}
</style>