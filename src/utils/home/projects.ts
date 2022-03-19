export type Technology = {
  name: string;
  comma?: string;
};

export type Project = {
  picture: {
    filename: string;
    objectFit?: string;
  };
  title: string;
  body: string;
  demo?: string;
  techStack: Technology[];
};

export const projects: Project[] = [
  {
    picture: {
      filename: "gravity-simulator.png",
    },
    title: "Gravity Simulator",
    body: "Simulate the gravitational interaction between different sized bodies",
    demo: "/projects/gravity-simulator",
    techStack: [
      {
        name: "p5.js",
      },
    ],
  },
  {
    picture: {
      filename: "sudoku-solver.png",
    },
    title: "Sudoku Solver",
    body: "Get hints to solve a sudoku, includes autocomplete functionality",
    demo: "/projects/sudoku-solver",
    techStack: [
      {
        name: "p5.js",
      },
    ],
  },
  {
    picture: {
      filename: "webgl.png",
    },
    title: "3D Renderer",
    body: "Render any 3D object in a JS canvas",
    demo: "/projects/webgl",
    techStack: [
      {
        name: "js",
      },
    ],
  },
  {
    picture: {
      filename: "notification-logger_mid-res.png",
      objectFit: "cover",
    },
    title: "Notification Logger",
    body: "Automatically save and share your smartphone's notifications in real time",
    techStack: [
      {
        name: "Android (Kotlin)",
        comma: ", ",
      },
      {
        name: "Telegram bot API",
      },
    ],
  },
];
