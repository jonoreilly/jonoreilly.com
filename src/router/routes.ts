import { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    meta: { title: "Jon O'Reilly" },
  },
  {
    path: "/projects",
    component: () => import("../views/EmptyParent.vue"),
    children: [
      {
        path: "webgl",
        component: () => import("../views/projects/WebGL.vue"),
        meta: { title: "Jon O'Reilly - Projects - WebGL" },
      },
      {
        path: "gravity-simulator",
        component: () => import("../views/projects/GravitySimulator.vue"),
        meta: { title: "Jon O'Reilly - Projects - Gravity simulator" },
      },
      {
        path: "sudoku-solver",
        component: () => import("../views/projects/SudokuSolver.vue"),
        meta: { title: "Jon O'Reilly - Projects - Sudoku solver" },
      },
    ],
  },
];
