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
      filename: "orion.png",
    },
    title: "Orion",
    body: "Simulate the gravitational interaction between different sized bodies",
    demo: "/projects/orion",
    techStack: [
      {
        name: "p5.js",
      },
    ],
  },
  {
    picture: {
      filename: "sudokutron.png",
    },
    title: "Sudokutron",
    body: "Get hints to solve a sudoku, includes autocomplete functionality",
    demo: "/projects/sudokutron",
    techStack: [
      {
        name: "p5.js",
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
  {
    picture: {
      filename: "homer.gif",
    },
    title: "Bluegate",
    body: "Easy message feed for the non tech-savy members of the family",
    techStack: [
      {
        name: "Python",
        comma: ", ",
      },
      {
        name: "PHP",
      },
    ],
  },
  {
    picture: {
      filename: "homer.gif",
    },
    title: "Crackdown",
    body: "Find the quickest solution to any rubiks cube automatically (or try it yourself)",
    techStack: [
      {
        name: "C#",
      },
    ],
  },
];
