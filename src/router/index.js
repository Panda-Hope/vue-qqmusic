import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { Indicator } from 'mint-ui'

// 重置组件加载函数，在异步下载过程添加 加载动画
// function asyncComponent(component, resolve) {
//     Indicator.open('加载中...');
//     require.ensure([component], () => {
//       Indicator.close();
//       let loaded = require(component);
//       resolve(loaded)
//     })
//     // require.ensure([component], (loaded) => {
//     //   Indicator.close();
//     //   resolve(loaded);
//     // });
// }

Vue.use(Router)

const router = new Router({
  linkActiveClass: '',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component(resolve) {
        require(['@/components/index'], resolve);
      }
    },
    {
      path: '/topList',
      name: 'topList',
      component(resolve) {
        require(['@/components/topList'], resolve);
      }
    },
    {
    	path: '/rankList/:id',
    	name: 'rankList',
    	component(resolve) {
        require(['@/components/rankList'], resolve);
    	}
    },
    {
      path: '/recommend/:id',
      name: 'recommend',
      component(resolve) {
        require(['@/components/recommend'], resolve);
      }
    },
    {
      path: '/playing',
      name: 'playing',
      meta: {
        noPageAnimation: true
      },
      beforeEnter(to, from, next) {
        store.state.playing.songlist.length > 0 && next();
      },
      component(resolve) {
        require(['@/components/playing'], resolve);
      }
    },
    {
      path: '/special',
      name: 'special',
      component(resolve) {
        require(['@/components/special'], resolve);
      }
    },
    {
      path: '/radio',
      name: 'radio',
      component(resolve) {
        require(['@/components/radio'], resolve);
      }
    },
    {
      path: '/singerlist',
      name: 'singerlist',
      component(resolve) {
        require(['@/components/singerlist'], resolve);
      }
    },
    {
      path: '/singer/:id',
      name: 'singer',
      component(resolve) {
        require(['@/components/singer'], resolve);
      }
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   // Indicator.open('加载中...');
//   console.log(11)
//   next();
// });

// router.afterEach((to) => {
//   store.commit('blurredPage/switchBlurredPage', to.name);
// })


export default router;