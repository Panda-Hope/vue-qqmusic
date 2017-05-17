import Vue from 'vue';
import store from '../store';
import {stackSonglist} from '../util';

// Vuex Playing Module NameSpace
const NameSpace = 'playing';

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
		playMusic(songlist, index) {
			let song = songlist[index],
				stack = stackSonglist(songlist, index);
			store.commit(NameSpace + '/stackSonglist', stack);
			store.dispatch(NameSpace + '/playSong', song);
		}
	}
});