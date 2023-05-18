<template>
  <div id="room_view">
    <div class="main">
      <div>
        <h1>房间号 {{ roomId }}</h1>
        <button @click="end_live">结束</button>
        <div style="width: 90vw; margin-left: 5vw; margin-right: 5vw">
          <el-row>
            <el-col :xs="24" :md="12" :lg="12" :xl="12">
              <div style="width: 100%">
                <video ref="localVideo" autoplay></video>
              </div>
            </el-col>
            <el-col :xs="24" :md="12" :lg="12" :xl="12">
              <div style="width: 100%">
                <img :src="remoteVideo" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/zip";

export default {
  name: "RoomView",
  computed: {
    roomId() {
      return this.$route.query.roomId;
    },
    name() {
      return this.$route.query.name;
    },
  },
  data() {
    return {
      masterName: "",
      guestName: "",
      localStream: null,
      remoteVideo: "",
      websocket: null,
      end: false,
    };
  },
  methods: {
    end_live() {
      this.end = true;
      this.websocket.send("end");
      this.websocket.close();
    },
    initMediaStream() {
      if (this.end) {
        return;
      }
      navigator.mediaDevices
        .getUserMedia({
          video: { width: 480, height: 480, mimeType: "video/webm" },
        })
        .then((stream) => {
          this.localStream = stream;
          this.$refs.localVideo.srcObject = stream;
          setTimeout(() => {
            this.localVideo();
          }, 3000);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
        });
    },
    localVideo() {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = this.$refs.localVideo.videoWidth;
      canvas.height = this.$refs.localVideo.videoHeight;
      const fps = 24;
      let showPng = setInterval(() => {
        if (this.end) {
          clearInterval(showPng);
          return;
        }
        // 在 Canvas 上绘制当前视频帧
        context.drawImage(
          this.$refs.localVideo,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // 将 Canvas 转换为图像数据（base64 格式）
        const imageData = canvas.toDataURL("image/jpeg");

        // 将图像数据发送给后端
        let zipBasePng = utils.zipStr(imageData);
        this.websocket.send(zipBasePng);
      }, 1000 / fps);
    },

    initWebsocket() {
      //const videoElement = document.getElementById("videoElement");
      this.websocket = new WebSocket(
        `ws://${process.env.VUE_APP_BASE_API}/api/ws/live?room_id=${this.roomId}&name=${this.name}`
      );
      // WebSocket event handlers
      this.websocket.onopen = () => {
        console.log("WebSocket connection opened");
        this.initMediaStream();
      };

      this.websocket.onmessage = async (event) => {
        let imgBase64 = utils.unzipStr(event.data);
        this.remoteVideo = imgBase64;
      };

      this.websocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    },
  },
  beforeDestroy() {
    this.end = true;
    this.websocket.close();
  },
  mounted() {
    this.initWebsocket();
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
