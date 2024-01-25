import { createApp } from 'vue';
import App from './App.vue'; // Make sure the file extension is correct (e.g., .vue)
import router from './router';
import store from './store';
import ViewUiPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import './styles/index.less';
import VueLazyLoad from 'vue3-lazyload';
import '@/assets/fonts/font.css';
import i18n from './language/index';

const initialDataAttr = document.getElementById('app').getAttribute('data-initial-data');
console.log(initialDataAttr);

if (initialDataAttr) {
  // Assuming initialDataAttr is a JSON string with a "message" property
  store.dispatch('setInitialData', (initialDataAttr));
} else {
  console.error('Initial data attribute not found or empty.');
}

const app = createApp(App);

app
  .use(router)
  .use(store)
  .use(i18n)
  .use(VueLazyLoad, {})
  .use(ViewUiPlus)
  .mount('#app');
