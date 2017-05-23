import Vue from 'vue';
import store from '../store';
import {stackSonglist, getCurrentIndex} from '../util';

// Vuex Playing Module NameSpace
const NameSpace = 'playing';

/* =================================================================
 * 这里提供两个全局的方法，不管感觉这里是挖坑了o(╯□╰)o，不应该这样提供全局方法的
 * ================================================================= */

// Gloabal Mixins
Vue.mixin({
	methods: {
		// // resolve the transition state before route switch
		// goforward(route) {
		// 	store.commit('transition/setTransition', 'turn-on');
		// 	return route;
		// },
		// backward() {
		// 	store.commit('transition/setTransition', 'turn-off')
		// },
		// GLobal Music Play Method
		playMusic(songlist, index, songid) {
			let song = songlist[index],
				stack = stackSonglist(songlist, index),
				songIndex = getCurrentIndex(stack, songid);
				
			store.commit(NameSpace + '/stackSonglist', stack);
			store.dispatch(NameSpace + '/playSong', songIndex);
		},
		goSpecial(url) {
			this.$router.push({
				name: 'special',
				query: {
					url: encodeURIComponent(url)
				}
			});
		}
	}
});