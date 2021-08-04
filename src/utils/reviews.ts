export type Review = {
  stars: number;
  title: string;
  body: string;
  signature: string;
};

export const reviews: Review[] = [
  {
    stars: 5,
    title: "Would recommend",
    body: "Great guy. Very good, very nice. Best of the best. lorem ipsum lorem ipsum lorem ipsum.",
    signature: "Sorin Andrei Veghiu",
  },
];
