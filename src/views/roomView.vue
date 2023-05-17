<template>
  <div id="room_view">
    <div class="main">
      <div>
        <h1>房间号 {{ roomId }}</h1>
        <div style="width: 90vw; margin-left: 5vw; margin-right: 5vw">
          <el-row>
            <el-col :xs="24" :md="12" :lg="12" :xl="12">
              <div style="width: 100%; height: 20px; background-color: red">
                <h3>{{ masterName }}</h3>
                <video ref="localVideo" autoplay></video>
              </div>
            </el-col>
            <el-col :xs="24" :md="12" :lg="12" :xl="12">
              <div style="width: 100%; height: 20px; background-color: black">
                <h3>{{ guestName }}</h3>
                <video ref="localVideo" autoplay></video>
              </div>
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
      remoteStream: null,
      peerConnection: null,
      websocket: null,
    };
  },
  methods: {
    async startVideoChat() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        this.localStream = stream;
        this.$refs.localVideo.srcObject = stream;

        this.peerConnection = new RTCPeerConnection();
        this.peerConnection.addStream(this.localStream);

        // Create WebSocket connection
        this.websocket = new WebSocket(
          `ws://localhost:8080/api/ws/live?room_id=${this.roomId}&name=${this.name}`
        );

        // WebSocket event handlers
        this.websocket.onopen = () => {
          console.log("WebSocket connection opened");

          // Send offer to the backend
          this.createOffer();
        };

        this.websocket.onmessage = async (event) => {
          const msg = JSON.parse(event.data);
          switch (msg.type) {
            case "offer":
              await this.peerConnection.setRemoteDescription(msg);
              // Send answer to the backend
              await this.createAnswer();
              break;

            case "answer":
              await this.peerConnection.setRemoteDescription(msg);
              break;

            case "candidate":
              await this.peerConnection.addIceCandidate(msg);
              break;
          }
        };

        this.websocket.onclose = () => {
          console.log("WebSocket connection closed");
        };
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    },

    async createOffer() {
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Send offer to the backend
      this.websocket.send(JSON.stringify(offer));
    },

    async createAnswer() {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Send answer to the backend
      this.websocket.send(JSON.stringify(answer));
    },
  },
  mounted() {
    axios
      .post(
        "http://127.0.0.1:8080/api/room/info",
        {
          room_id: parseInt(this.roomId),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        this.masterName = res.data["master_name"];
        this.guestName = res.data["guest_name"];
        this.startVideoChat();
      })
      .catch((err) => {
        let errText = "系统错误";
        try {
          errText = err.response.data.error;
        } catch (e) {
          console.log(e);
        }
        alert(errText);
        this.$router.push("/");
      });
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
