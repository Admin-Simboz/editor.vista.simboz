
import { createRouter, createWebHashHistory } from 'vue-router'; 
import routes from './routes'; 

// Create and configure the Vue Router instance
export default createRouter({
  routes, // Assigning the imported routes to the 'routes' property

  history: createWebHashHistory(),//navigation within app

  // Defining custom scroll behavior for navigating between routes
  scrollBehavior() {
    return { top: 0 }; // Scrolls to the top of the page on route navigation
  },
});
