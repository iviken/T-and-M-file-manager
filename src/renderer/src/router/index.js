import { createRouter, createMemoryHistory } from 'vue-router'
// import { createRouter, createWebHistory } from 'vue-router'
import BrowserView from '../views/BrowserView.vue'
import HelpView from '../views/HelpView.vue'
import ProjectsListView from '../views/ProjectsListView.vue'
import UnsplashView from '../views/UnsplashView.vue'

const router = createRouter({
  history: createMemoryHistory(import.meta.env.BASE_URL),
  // history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/BrowserView',
      name: 'Browser-projects',
      component: BrowserView,
      props: {sessionType: 'PROJECTS'}
    },
    {
      path: '/BrowserView',
      name: 'Browser-session',
      component: BrowserView,
      props: {sessionType: 'SESSION'}
    },
    {
      path: '/HelpView',
      name: 'Help',
      component: HelpView,
    },
    {
      path: '/',
      // path: '/ProjectsListView',
      name: 'ProjectsList',
      component: ProjectsListView,
    },
    {
      path: '/UnsplashView',
      name: 'Unsplash',
      component: UnsplashView,
    }
  ]
})

export default router
