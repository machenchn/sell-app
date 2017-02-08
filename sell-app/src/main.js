import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
// import App from './App';
import Home from './Home';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
import business from 'components/business/business';
import orders from 'components/orders/orders';
import mine from 'components/mine/mine';
import app from 'components/app/app';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

// let app = Vue.extend(App);
let home = Vue.extend(Home);

let router = new VueRouter({
  linkActiveClass: 'active',
  history: false, // html5
  saveScrollPosition: true, // html5
  root: '/'
});

let routerPath = {
  '/': {
    component: business
  },
  '/business': {
    component: business
  },
  '/shop': {
    component: app,
    subRoutes: {
            '/goods': {
              component: goods
            },
            '/ratings': {
              component: ratings
            },
            '/seller': {
              component: seller
            }
        }
  },
  '/orders': {
    component: orders
  },
  '/mine': {
    component: mine
  },
  '/business/home': {
    component: app
  }
};
router.map(routerPath);
router.redirect({
    '/': '/business'
});

router.start(home, '#app');
// router.start(app, '#app2');
// router.go('/goods');
