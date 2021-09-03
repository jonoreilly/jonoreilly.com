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
        path: "gravity-simulator",
        component: () => import("../views/projects/GravitySimulator.vue"),
      },
      {
        path: "sudoku-solver",
        component: () => import("../views/projects/SudokuSolver.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
