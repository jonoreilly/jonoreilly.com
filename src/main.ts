import { createApp } from "vue";
import App from "@/App.vue";
import "@/registerServiceWorker";
import router from "@/router";
import store from "@/store";
import VueGtag from "vue-gtag";
import { config } from "@/utils/plugins/gtag";

createApp(App)
  .use(store)
  .use(router)
  .use(VueGtag, { config }, router)
  .mount("#app");
