export type Review = {
  stars: number;
  title: string;
  body: string;
  signature: {
    name: string;
    contact: string;
  };
};

export const reviews: Review[] = [
  {
    stars: 5,
    title: "Would recommend",
    body: "Jon has a natural focused attitude when it comes to bringing quality code, especially in terms of front-end design, into the product(s) he works on. As well as always seeking new frameworks or various ways to learn new technologies while bringing innovation to his daily work.",
    signature: {
      name: "Sorin Andrei Veghiu",
      contact: "https://www.linkedin.com/in/sorin-veghiu/",
    },
  },
];
