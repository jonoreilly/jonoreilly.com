import { RouteRecordRaw } from "vue-router";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/Home.vue"),
    meta: {
      title: "Jon O'Reilly",
      metaTags: [
        {
          name: "description",
          content: "Hi, I'm Jon O'Reilly. I'm a Front-end engineer.",
        },
      ],
    },
  },
  {
    path: "/projects",
    component: () => import("../views/EmptyParent.vue"),
    children: [
      {
        path: "webgl",
        component: () => import("../views/projects/WebGL.vue"),
        meta: {
          title: "Jon O'Reilly - Projects - WebGL",
          metaTags: [
            {
              name: "description",
              content:
                "With the power of WebGL you can view and manipulate 3D objects.",
            },
          ],
        },
      },
      {
        path: "gravity-simulator",
        component: () => import("../views/projects/GravitySimulator.vue"),
        meta: {
          title: "Jon O'Reilly - Projects - Gravity simulator",
          metaTags: [
            {
              name: "description",
              content:
                "Simulate the Gravitational interactions between multiple planets.",
            },
          ],
        },
      },
      {
        path: "sudoku-solver",
        component: () => import("../views/projects/SudokuSolver.vue"),
        meta: {
          title: "Jon O'Reilly - Projects - Sudoku solver",
          metaTags: [
            {
              name: "description",
              content:
                "New and improved Sudoku game, with automatic hints and autocomplete functionality.",
            },
          ],
        },
      },
    ],
  },
];
