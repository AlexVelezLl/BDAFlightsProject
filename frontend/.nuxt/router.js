import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _f7ce9bc2 = () => interopDefault(import('..\\pages\\booking.vue' /* webpackChunkName: "pages/booking" */))
const _04e6f4cc = () => interopDefault(import('..\\pages\\flight.vue' /* webpackChunkName: "pages/flight" */))
const _5fe5aa7a = () => interopDefault(import('..\\pages\\passengers.vue' /* webpackChunkName: "pages/passengers" */))
const _604d0198 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/booking",
    component: _f7ce9bc2,
    name: "booking"
  }, {
    path: "/flight",
    component: _04e6f4cc,
    name: "flight"
  }, {
    path: "/passengers",
    component: _5fe5aa7a,
    name: "passengers"
  }, {
    path: "/",
    component: _604d0198,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
