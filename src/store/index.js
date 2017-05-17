import Vue from 'vue';
import Vuex from 'vuex';
import {getCurrentIndex, shuffle} from '../util';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
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
					state.songlist = [...(stack instanceof Array ? stack : [])];
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
						dispatch('playNext');
					}
				},
				// play a new song
				playSong({state, commit, dispatch}, song) {
					state.songMsg = { ...state.songMsg, ...(typeof song == 'object' ? song : {})};
					state.songState.playingState = 'play' + state.songMsg.data.songid;
					dispatch('resetProgress');
					commit('pause');
				},
				playNext({state, commit, dispatch}) {
					let songlist = state.songlist,
						length = songlist.length,
						playingOrder = state.songState.playingOrder,
						currentIndex = getCurrentIndex(songlist, state.songMsg.data.songid),
						nextSong = {};
					switch(playingOrder) {
						case 'cycle': 
							nextSong = songlist[currentIndex >= length - 1 ? 0 : currentIndex + 1];
							break;
						case 'random':
							nextSong = shuffle(songlist)[0];
							break;
						case 'singleCycle': 
							nextSong = songlist[currentIndex];
							break;
					}
					dispatch('playSong', nextSong);
				},
				playPrev({state, commit, dispatch}) {
					let songlist = state.songlist,
						length = songlist.length,
						playingOrder = state.songState.playingOrder,
						currentIndex = getCurrentIndex(songlist, state.songMsg.data.songid),
						prevSong = {};
					switch(playingOrder) {
						case 'cycle': 
							prevSong = songlist[currentIndex == 0 ? length - 1 : currentIndex - 1];
							break;
						case 'random':
							prevSong = shuffle(songlist)[0];
							break;
						case 'singleCycle': 
							prevSong = songlist[currentIndex];
							break;
					}
					dispatch('playSong', prevSong);
				}
			}
		}
	}
});
