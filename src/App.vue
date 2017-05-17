<template>
  <div id="app">
	  <transition :name="transitionName" @afterLeave="clearTransition">
	  	<!-- <keep-alive> -->
		  <router-view></router-view>
	  	<!-- </keep-alive> -->
	  </transition>
	  <play-fixed></play-fixed>
  </div>
</template>

<script>
	import { mapState } from 'vuex';
	import store from './store';

	export default {
		name: 'app',
		data() {
			return {
				prevRoutes: []
			}
		},
		watch: {
			/* ========================================
			 * Apply Slide Transition Effects For
			 * Each Route Switch,Except Some Route That
			 * Don't Need Transition Effect
			 * ========================================= */
			$route(to, from) {
				if (!(to.meta.noPageAnimation || from.meta.noPageAnimation)) {
					if (to.name === this.prevRoutes[this.prevRoutes.length-1]) {
						store.commit('transition/setTransition', 'turn-off');
						this.prevRoutes.pop();
					}else {
						if (from.name != null) {
							store.commit('transition/setTransition', 'turn-on');
							this.prevRoutes.push(from.name);
						}
					} 
				}
			}
		},
		methods: {
			// Clear Transition Effects After Each Switch
			clearTransition() {
				store.commit('transition/setTransition', '');
			}
		},
		computed: mapState('transition', ['transitionName']),
		components: {
			playFixed(resolve) {
				require(['@/components/play-fixed.vue'], resolve);
			}
		}
	};
</script>

