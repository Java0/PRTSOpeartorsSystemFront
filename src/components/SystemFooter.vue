<template>
    <div class="background">
        <div class="container">
            <div class="icp">ICP备案号：新ICP备00000000号</div>
            <div class="police">
                <img src="../assets/police.png" alt="">
                <span>公安机关备案号:1145141919810</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SystemFooter'
}
</script>

<style lang="less" scoped>
.background {
    width: 100%;
    height: 100px;
    background-color: #2b2b2b;
    color: #c9cbd0;
    position: absolute;
    bottom: 0;

    .container {
        height: 100px;
        margin: 0 200px 0 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }
}
</style>>

