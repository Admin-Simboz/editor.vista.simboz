

import { createApp } from 'vue'; 
import App from './App'; //main App component to render within the Vue app
import router from './router'; //  configuration for Vue Router
import ViewUiPlus from 'view-ui-plus'; //  additional UI components
import 'view-ui-plus/dist/styles/viewuiplus.css'; 
import './styles/index.less'; // global LESS styles for the entire application
import VueLazyLoad from 'vue3-lazyload'; //  for lazy loading images
// import { registerSW } from 'virtual:pwa-register'; // service worker registration 
// Custom font files
import '@/assets/fonts/font.css'; 
// import axios from 'axios'; 

import i18n from './language/index'; //  the internationalization configuration for multilingual support


// if ('serviceWorker' in navigator) {
//   registerSW();
// }


const app = createApp(App); // Creating a Vue app instance using the main App component

// Optional: Configure global properties, such as adding Axios for HTTP requests
// This line is commented out, potentially for future use of Axios as a global property
// app.config.globalProperties.$http = axios;

// Mount the app to the '#app' element in the DOM
app
  .use(router) // Integrating the Vue Router configuration into the Vue app
  .use(i18n) // Integrating internationalization configuration for multilingual support
  .use(VueLazyLoad, {}) // Enabling VueLazyLoad for efficiently loading images
  .use(ViewUiPlus) // Integrating ViewUiPlus library for additional UI components
  .mount('#app'); // Mounting the Vue app to the '#app' element in the HTML DOM
