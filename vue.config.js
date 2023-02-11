/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var PrerenderSPAPlugin = require("prerender-spa-plugin");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
        @import "@/assets/scss/_variables.scss";
        `,
      },
    },
  },
  configureWebpack: (config) => {
    config.plugins.push(
      new PrerenderSPAPlugin({
        // Required - The path to the webpack-outputted app to prerender.
        staticDir: path.join(__dirname, "dist"),
        // Required - Routes to render.
        routes: [
          "/",
          "/projects/webgl",
          "/projects/gravity-simulator",
          "/projects/sudoku-solver",
        ],
        renderOption: {
          forceMock: {
            "https://preview.p5js.org/jonoreilly/embed/iLJUPN0dF": "Sudoku",
            "https://preview.p5js.org/jonoreilly/embed/d2OGrtoVm": "Gravity",
          },
        },
      })
    );
    config.module.rules.push({ test: /\.obj$/i, use: "raw-loader" });
  },
};
