import { createApp } from 'vue'
import Index from './pages/index.vue'
import './style.css'

import "vue3-openlayers/styles.css";

import OpenLayersMap from "vue3-openlayers";

const app = createApp(Index);

app.use(OpenLayersMap /*, options */);

app.mount("#app");
