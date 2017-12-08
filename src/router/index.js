import Vue from 'vue'
import Router from 'vue-router'
import Route from '@/components/Route'
import RouteDetail from '@/components/RouteDetail'
import Site from '@/components/Site'
import SiteDetail from '@/components/SiteDetail'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'is-active',
  // linkExactActiveClass: 'is-active',
  routes: [
    {
      path: '/',
      redirect () {
        return 'route'
      }
    },
    {
      path: '/route',
      name: 'route',
      component: Route
    },
    {
      path: '/site',
      name: 'site',
      component: Site
    },
    {
      path: '/route/:lineName/:isUpDown',
      name: 'routeDetail',
      component: RouteDetail
    },
    {
      path: '/site/:passLine/:stationName',
      name: 'siteRoute',
      component: SiteDetail
    }
  ]
})
