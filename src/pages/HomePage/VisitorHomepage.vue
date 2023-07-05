<template>
  <div class="container" ref="noLogInfoContainer">
    <div class="sign">
      <div class="avatar"></div>
      <div class="name"></div>
      <div class="authority"></div>
    </div>

    <div class="archive">
      <div class="title"></div>
      <div class="info order">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info id">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info sex">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info combat-experience">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info birthplace">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info birthday">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info height">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info oripathy-infection-status">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="title"></div>
      <div class="info physical-strength">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info battlefield-mobility">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info physiology">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info tactical-planning">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info combat-skills">
        <div class="key"></div>
        <div class="value"></div>
      </div>
      <div class="info originium-arts-adaptability">
        <div class="key"></div>
        <div class="value"></div>
      </div>
    </div>
    <div class="archive-info">
      <div class="title"></div>
      <div class="text"></div>
      <div class="text"></div>
      <div class="title"></div>
      <div class="text"></div>
      <div class="text"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisitorHomepage',
  data() {
    return {
      currentWidth: screen.width,
      currentHeight: screen.height,
      newSize: {
        newWidth: '',
        newHeight: '',
      },
      scaleRange: screen.height / 1080
    }
  },

  methods: {
    scale() {
      console.log('run');
      const container = this.$refs.noLogInfoContainer;
      container.style.height = container.offsetHeight * this.scaleRange + 'px';
      for (let e of container.children) {
        this.changeSize(e.children);
      }
    },
    changeSize(elements) {
      for (let e of elements) {
        if (e.classList.contains('info')) {
          this.changeSize(e.children);
        } else {
          e.style.marginTop = 10 * this.scaleRange + 'px';
          e.style.width = e.offsetWidth * this.scaleRange + 'px';
          e.style.height = e.offsetHeight * this.scaleRange + 'px';
          this.changeSize(e.children);
        }

      }
    },
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
    ), 200);
    this.scale();
  },
}
</script>

<style scoped lang="less">
.container {
  height: 540px;
  margin: 0 200px 0 100px;
  display: flex;
  justify-content: space-between;

  .basic() {
    background-color: #404040;
    border-radius: 5px;
    margin-top: 10px;
  }

  .sign {
    display: flex;
    flex-direction: column;
    align-content: space-between;

    .avatar {
      width: 408px;
      height: 408px;
      .basic();
    }

    .name {
      width: 308px;
      height: 51px;
      .basic()
    }

    .authority {
      width: 208px;
      height: 51px;
      .basic()
    }

  }

  .archive {
    .title {
      width: 450px;
      height: 15px;
      .basic();
    }

    .info {
      display: flex;
      justify-content: start;

      .key {
        width: 145px;
        height: 25px;
        margin-right: 10px;
        .basic()
      }

      .value {
        width: 250px;
        height: 25px;
        .basic()
      }

    }

  }

  .archive-info {
    .title {
      width: 450px;
      height: 15px;
      .basic();
    }

    .text {
      width: 415px;
      height: 130px;
      .basic()
    }

    & .text:last-child {
      height: 60px;
    }


  }


}
</style>