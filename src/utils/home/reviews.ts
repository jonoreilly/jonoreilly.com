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
    body: "Great guy. Very good, very nice. Best of the best.",
    signature: {
      name: "Sorin Andrei Veghiu",
      contact: "https://www.linkedin.com/in/sorin-veghiu/",
    },
  },
];
