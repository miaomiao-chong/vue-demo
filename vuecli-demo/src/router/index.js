import { createRouter, createWebHistory } from 'vue-router'
import Marquee from '../views/Marquee'
const routes = [
  {
    path: '/marquee',
    name: 'Marquee',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component:Marquee
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
