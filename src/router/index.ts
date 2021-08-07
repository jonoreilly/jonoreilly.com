import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/projects",
    component: () => import("../views/EmptyParent.vue"),
    children: [
      {
        path: "webgl",
        component: () => import("../views/projects/WebGL.vue"),
      },
      {
        path: "orion",
        component: () => import("../views/projects/Orion.vue"),
      },
      {
        path: "sudokutron",
        component: () => import("../views/projects/Sudokutron.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
