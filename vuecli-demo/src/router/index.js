import { createRouter, createWebHistory } from 'vue-router'
import Marquee from '../views/Marquee'
import RankList from '../views/rank'
import Debounce from '../views/debounce'
import Index from '../views/index'
import Fenye from '../views/fenye'
const routes = [
  {
    path: '/',
    name: 'haha',
    component: Index,
    
  },
  {
    path: '/marquee',
    name: 'Marquee',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component:Marquee
  },
  {
    path: '/rank',
    name: 'rank',
    component:RankList
  },
  {
    path: '/debounce',
    name: 'debounce',
    component : Debounce
  },
  {
    path: '/fenye',
    name: 'fenye',
    component : Fenye
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
