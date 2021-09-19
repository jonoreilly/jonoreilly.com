import { createApp } from "vue";
import App from "@/App.vue";
import "@/registerServiceWorker";
import router from "@/router";
import store from "@/store";
import VueMatomo from "vue-matomo";
import { getMatomoSettings } from "@/utils/matomo/matomo";
import "@/utils/firebase";

createApp(App)
  .use(store)
  .use(router)
  .use(VueMatomo, getMatomoSettings(router))
  .mount("#app");
