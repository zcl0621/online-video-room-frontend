import Vue from "vue";
import VueRouter from "vue-router";
import IndexView from "@/views/indexView.vue";
import JoinView from "@/views/joinView.vue";
import RoomView from "@/views/roomView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: IndexView,
  },
  {
    path: "/join",
    name: "join",
    component: JoinView,
  },
  {
    path: "/room",
    name: "room",
    component: RoomView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
