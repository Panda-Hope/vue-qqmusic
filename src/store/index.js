import Vue from 'vue';
import Vuex from 'vuex';
import {getCurrentIndex, shuffle} from '../util';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		// route switch object
		transition: {
			namespaced: true,
			state: {
				transitionName: '',
				action: []
			},
			mutations: {
				setTransition(state, transition) {
					state.transitionName = transition;
				}
			}
		},
		// bottom fixed song list
		list: {
			namespaced: true,
			state: {
				// if show the list
				show: false,
			},
			mutations: {
				toggleShow(state) {
					state.show = !state.show;
				}
			}
		},
		playing: {
			namespaced: true,
			state: {
				// playing song detail msg
				songMsg: {
					data: {},
					getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
					songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000'
				},
				// song list
				songlist: [],
				songState: {
					// Music Play State Provide Two State
					// 1: pause, 2: playing + songid
					playingState: 'pause',
					// current time play percentage
					playingProgress: 0,
					// current play progress time
					current: 0,
					// playing song index in current songlist
					currentIndex: 0,
					// curent playing lyric index in currentLyric array
					currentLyricIndex: '',
					// current lyric playing time
					currentLyricDuration: '',
					// current lyrics array
					currentLyricArr: [],
					// Song Duration Time
					timing: 0,
					// playingOrder provide three state
					// 1: cycle, 2: singleCycle, 3: random,
					playingOrder: 'cycle'
				}
			},
			mutations: {
				// play or pause music
				pause(state, status) {
					let songid = state.songMsg.data.songid;
					state.songState.playingState = status == 'pause' || songid == null ? 'pause' : 'playing' + songid;
				},
				// swtich the current lyric index
				switchLyricIndex(state, index) {
					state.songState.currentLyricIndex = index;
				},
				switchLyricsArr(state, lyricArr) {
					state.songState.currentLyricArr = lyricArr instanceof Array ? lyricArr : [];
				},
				switchLyricDuration(state, duration) {
					state.songState.currentLyricDuration = duration;
				},
				// stack songlist
				stackSonglist(state, stack) {
					state.songlist = [...(stack instanceof Array ? stack : [stack || {}])];
					state.currentIndex = 0;
				},
				pushSonglist(state, stack) {
					state.songlist = [...state.songlist, ...(stack instanceof Array ? stack : [])];
				},
				switchPlayOrder(state) {
					let	orderArr = ['cycle', 'singleCycle', 'random'],
						current = orderArr.indexOf(state.songState.playingOrder);
					state.songState.playingOrder = orderArr[current >= 2 ? 0 : current + 1];
				}
			},
			actions: {
				// Reset Play Progress To Some Point
				resetProgress({state, dispatch}, payload = {currentTime: 0, duration: 0}) {
					let current = parseInt(payload.currentTime),
						timing = parseInt(payload.duration);

					state.songState.playingProgress = current/timing;
					state.songState.current = current;
					state.songState.timing = timing;
					if (current >= timing && timing>0) {
						dispatch('playSong', 'next');
					}
				},
				/* 
				 * play a new song
				 * index == string ? next : prev
				 * index == number go specify song
				 * */
				playSong({state, commit, dispatch}, index) {
					let nextIndex;
					// judge if play next or play specify song
					if (typeof index == 'string') {
						let playingOrder = state.songState.playingOrder,
							songlist = state.songlist,
							length = songlist.length,
							currentIndex = state.currentIndex;

						switch(playingOrder) {
							case 'cycle': 
								if (index == 'next') {
									nextIndex = currentIndex >= length - 1 ? 0 : ++currentIndex;
								}else if (index == 'prev') {
									nextIndex = currentIndex == 0 ? length - 1 : --currentIndex;
								}
								break;
							case 'random':
								nextIndex = shuffle(songlist)[0];
								break;
							case 'singleCycle': 
								nextIndex = currentIndex;
								break;
						}
					}else {
						nextIndex = index >> 0;
					}

					let songMsg =  state.songlist[nextIndex];
					state.songState.currentIndex = nextIndex;
					state.songMsg = {...state.songMsg, ...songMsg};
					state.songState.playingState = 'play' + state.songMsg.data.songid;

					dispatch('resetProgress');
					commit('pause');
				},
				// clear song in stack list
				clearSong({state, dispatch}, index) {
					state.songlist.splice(index >> 0, 1);
					dispatch('playSong', 'next');
				},	
			    // clear all song msg
				clearSongStack({state, commit, dispatch}) {
					let defaultSongMsg = {
						data: {},
						getMedia: media => media ? `http://ws.stream.qqmusic.qq.com/${media}.m4a?fromtag=46` : '',
						songblum_prfix: 'http://imgcache.qq.com/music/photo_new/T002R150x150M000'
					};
					state.songlist = [];
					state.songMsg = defaultSongMsg;
					// dispatch('resetProgress');
					commit('pause', 'pause');
				}
			}
		}
	}
});
