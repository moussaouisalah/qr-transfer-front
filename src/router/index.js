import { createRouter, createWebHistory } from "vue-router";
import Room from "../views/Room.vue";

const routes = [
  { path: "/:id", component: Room },
  { path: "/", component: Room },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
