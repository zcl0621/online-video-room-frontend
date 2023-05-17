<template>
  <div id="index-view">
    <div class="main">
      <el-row>
        <el-col :span="24">
          <h1>请输入您的昵称</h1>
        </el-col>
        <el-col :span="18" :offset="3">
          <el-input v-model="name"></el-input>
        </el-col>
        <el-col :span="24">
          <el-button
            @click="goToRoom"
            type="primary"
            style="margin-top: 1vh"
            :disabled="name === ''"
            >确定
          </el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "IndexView",
  data() {
    return {
      name: "",
    };
  },
  methods: {
    goToRoom() {
      this.$router.push(`/join?name=${this.name}`);
    },
  },
};
</script>

<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
