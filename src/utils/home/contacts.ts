export type Contact = {
  tooltip: string;
  link: string;
  icon: string;
};

export const contacts: Contact[] = [
  {
    tooltip: "My LinkedIn",
    link: "https://www.linkedin.com/in/jon-o-reilly-del-cerro-0a1a0415a/",
    icon: "linkedin",
  },
  {
    tooltip: "My email (jon@jonoreilly.com)",
    link: "mailto:jon@jonoreilly.com",
    icon: "at",
  },
  {
    tooltip: "Call me (+34 644540989)",
    link: "tel:+34644540989",
    icon: "phone-alt",
  },
  {
    tooltip: "My Github",
    link: "https://github.com/jonoreilly",
    icon: "github",
  },
  {
    tooltip: "My CV",
    link: "./media/CV_JonOReilly_2021.pdf",
    icon: "file-pdf",
  },
];
