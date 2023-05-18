<template>
  <div id="join-view">
    <div class="main">
      <div>
        <h1>欢迎 {{ name }} 加入会议</h1>
        <div style="height: 10vh; width: 100vw">
          <el-row>
            <el-col :span="4" :offset="7">
              <el-button type="primary" @click="joinRoom">加入会议</el-button>
            </el-col>
            <el-col :span="4" :offset="2">
              <el-button type="primary" @click="createRoom">创建会议</el-button>
            </el-col>
          </el-row>
        </div>
        <div style="width: 100vw; height: 40vh">
          <el-row v-if="handlerType === 1">
            <el-col :span="24">
              <h2>请输入房间号</h2>
            </el-col>
            <el-col :span="18" :offset="3">
              <el-input v-model="roomId"></el-input>
            </el-col>
            <el-col :span="24">
              <el-button
                @click="goToRoom"
                type="primary"
                style="margin-top: 1vh"
                :disabled="roomId === ''"
                >确定
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "JoinView",
  computed: {
    name() {
      return this.$route.query.name;
    },
  },
  data() {
    return {
      roomId: "",
      handlerType: 0,
    };
  },
  methods: {
    goToRoom() {
      if (this.roomId && this.name) {
        axios
          .post(
            `http://${process.env.VUE_APP_BASE_API}/api/room/join`,
            {
              name: this.name,
              room_id: parseInt(this.roomId),
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((res) => {
            this.$router.push(
              `/room?roomId=${res.data.room_id}&name=${this.name}`
            );
          })
          .catch((err) => {
            let errText = "系统错误";
            try {
              errText = err.response.data.error;
            } catch (e) {
              console.log(e);
            }
            alert(errText);
          });
      }
    },
    joinRoom() {
      this.handlerType = 1;
    },
    createRoom() {
      this.handlerType = 0;
      axios
        .post(
          `http://${process.env.VUE_APP_BASE_API}/api/room/create`,
          {
            name: this.name,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          this.$router.push(
            `/room?roomId=${res.data.room_id}&name=${this.name}`
          );
        })
        .catch((err) => {
          let errText = "系统错误";
          try {
            errText = err.response.data.error;
          } catch (e) {
            console.log(e);
          }
          alert(errText);
        });
    },
  },
  mounted() {
    if (!this.name) {
      this.$router.push("/");
    }
  },
};
</script>
<style scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>
