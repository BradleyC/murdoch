import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dappmin from '@/components/Dappmin'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dappmin',
      name: 'Dappmin',
      component: Dappmin
    }
  ]
})
