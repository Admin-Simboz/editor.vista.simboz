
import type { RouteRecordRaw } from 'vue-router';

// Define an array of RouteRecordRaw for route configuration
const routes: RouteRecordRaw[] = [
  {
    // Define the path for the route
    path: '/',
    // Define the component to be rendered for the specified path
    // Lazy loading: Loads the component asynchronously when the route is visited
    component: () => import('@/views/home/index.vue'), // Dynamic import using webpack's code splitting
  },
];

// Export the configured routes for Vue Router to use
export default routes;

