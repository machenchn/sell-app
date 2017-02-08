import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Home from './Home';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import business from 'components/business/business';
import orders from 'components/orders/orders';
import mine from 'components/mine/mine';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

// let app = Vue.extend(App);
let home = Vue.extend(Home);

let router = new VueRouter({
  linkActiveClass: 'active'
});

router.map({
  '/': {
    component: business
  },
  '/business': {
    component: business
  },
  '/orders': {
    component: orders
  },
  '/mine': {
    component: mine
  },
  '/business/home': {
    component: App
  },
  '/business/goods': {
    component: goods
  },
  '/business/ratings': {
    component: ratings
  },
  '/business/seller': {
    component: seller
  }
});

router.start(home, '#app');
// router.start(app, '#app2');
// router.go('/goods');
