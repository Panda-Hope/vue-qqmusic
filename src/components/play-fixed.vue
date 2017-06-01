<template>
  <div class="fixed-wrapper">
  	  <mt-cell class="music-cell-song-fixed">
		<router-link tag="div" 
					 class="song-cover" 
					 :to="{name: 'playing'}"
					 @touchstart.native="swipeStart"
					 @touchmove.native="swipeMove"
					 @touchend.native="swipeEnd">
		  <img :src="ablumImgUrl" 
		  	   class="song-album-img" 
		  	   :class="{'spin-slow': playingState != 'pause'}">
		  <div class="name-desc">
		  	<p>{{ songMsg.data.songname }}</p>
		  	<p >{{ currentLyric || (songMsg.data.singer && songMsg.data.singer[0].name) }}</p>
		  </div>
		</router-link>
		<div class="play-wrapper">
			<div class="circle-wrapper">
				<svg class="progress-circle" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg">
	                <circle 
	                	class="progress-circle-prog" 
	                	cx="12" 
	                	cy="12" 
	                	r="11.1" 
	                	ref="progress"
	                	:style="{strokeDasharray: playingPrgress*70+ ', 70'}"></circle>
	            </svg>
	            <img 
	            @click="pause(playingState == 'pause' ? '' : 'pause')"
	            :src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-small':'pause'}.png`)"
	            class="play-icon">
			</div>
			<img src="../assets/list-green.png" class="list-icon" @click="toggleShow">
		</div>
	  </mt-cell>
	  <audio :src="songMsg.getMedia(songMsg.data.songid)" ref="audio" @timeupdate="_playProgress"></audio>
  </div>
</template>

<script>
	/* ==============================================================
	 *                 			底部音乐播放组件
	 * 已完成功能：
	 *   1： 音乐播放，暂停
	 *	 2： 当前音乐播放完成，自动播放下一首
	 *	 3： 歌词自动随进度播放
	 *.  4： 滑动切换歌曲
	 * 已成完成UI：
	 *	 1： 歌手头像随音乐播放转动
	 *	 2： 播放圆圈随播放进度自动滚动
	 *   Issuse:
	 *		在这里这个组件在QQ音乐上其实是一个背景模糊的组件
	 *		这个效果在前端其实是可以实现的详情大家可以参考下 http://codepen.io/rikschennink/pen/zvcgx
	 * 		但是考虑到虽然可以实现但是实现成本过大，于是最终还是决定放弃
	 *  Issuse:
	 *		这里存在一个IOS Safari的BUG -webkit-animatin-pause 在IOS下会被完全忽略想请可以查看
	 *		http://stackoverflow.com/questions/27683012/css-animation-play-state-paused-doesnt-work-in-ios
	 *		因而改为直接在封面滚动的动画上改为animation的添加和删除也由此使得头像的滚动动画无法暂停而是重新开始
	 * 播放原理简介：
	 *   采用Vuex统一管理当前播放歌曲信息、歌曲列表、
	 *   播放进度数据， 根据Vuex数据变化自动做出相应变化
	 * ============================================================== */

	import store from '../store';
	import base64 from 'base-64';
	import utf8 from 'utf8';
	import { jsonp } from '@/api/index';
	import { mapState, mapMutations, mapActions } from 'vuex';
	import { lyricsAnalysis } from '../util';
	const NameSpace = 'playing';

	export default {
		name: 'play-fixed',
		data() {
			return {
				currentLyric: '',
				lyricsObj: {
				  timeArr: [],       // each lyric start time
				  lyricsArr: [],    // each item lyric
				  durationArr: []  // each lyric cost time,
				},
				swipeObj: {
					start: {
						x: 0
					},
					move: {
						x: 0
					}
				}
			};
		},
		computed: {
			...mapState(NameSpace, ['songMsg', 'songState']),
			playingState() {
				return this.songState.playingState;	
			},
			playingSongid() {
				return this.songMsg.data.songid;
			},
			playingPrgress() {
				return this.songState.playingProgress;
			},
			currentTime() {
				return this.songState.current;
			},
			pruneTime() {
				return this.songState.pruneTime;
			},
			ablumImgUrl() {
				let albummid = this.songMsg.data.albummid;
				if (albummid) {
					return this.songMsg.songblum_prfix + albummid + '.jpg?max_age=2592000';
				}else {
					// default image
					return 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6';
				}
			}
		},
		watch: {
			// Play Or Pause When PlayingState Modified
			playingState(state) {
				let audio = this.$refs.audio;
				
				if (state == 'pause') {
					audio.pause()
				}else {
					// Check if first frame has been downloaded, otherwise recursice call this function
					// 30 times if it still fail throw a error and change the play state
					let stack = 0;
					function recursivePlay() {
						// Attention the play method return a promise
						let playPromise = audio.play();
						if (playPromise) {
							playPromise.catch(e => {
								setTimeout(() => {
									++stack >= 30 ? (alert('音乐加载失败， 请重试'), store.commit(NameSpace+ '/pause', 'pause')) : recursivePlay();
								}, 500)
							});
						}
					}
					// must update the dom view first, because the audio src has not been updated now
					// the deep reason for this is because Vue watch method excute is take prioirty than 
					// dom view update
					this.$nextTick(recursivePlay);
				}
			},
			// load the lyrics msg when playing song changed
			playingSongid() {
				let self = this;
				jsonp({
					url: `https://api.darlin.me/music/lyric/${this.playingSongid}/?callback=jsonp1`,
					jsonpCallback: 'jsonp1'
				}, reponse => {
					// decode lyrics from base64 encode and utf-8 decode
					let lyrics = utf8.decode(base64.decode(reponse.lyric));
					
					self.lyricsObj = lyricsAnalysis(lyrics);
					self.switchLyricsArr(self.lyricsObj.lyricsArr);
				})
			},
			// switch the current lyric as time goes by
			currentTime(time) {
				let	timeArr = this.lyricsObj.timeArr,
					lyricsArr = this.lyricsObj.lyricsArr,
					durationArr = this.lyricsObj.durationArr;

				timeArr.forEach((item, index) => {
					if (item == parseInt(time)) {
						this.currentLyric = lyricsArr[index];
						this.switchLyricIndex(index);
						this.switchLyricDuration(durationArr[index]);
					}
				});
			},
			pruneTime(time) {
				let audio = this.$refs.audio;
				audio.currentTime = time;
			}
		},
		methods: {
			...mapMutations(NameSpace, ['pause', 'switchLyricIndex', 'switchLyricsArr', 'switchLyricDuration']),
			...mapMutations('list', ['toggleShow']),
			...mapActions(NameSpace, ['playSong']),
			_playProgress(e) {
				let audio = e.target,
					currentTime = audio.currentTime,
					duration = audio.duration;
				store.dispatch(NameSpace + '/resetProgress', {currentTime, duration});
			},
			swipeStart(e) {
				let touch = e.changedTouches[0];
				this.swipeObj.x = touch.clientX;
			},
			swipeMove(e) {
				this.swipeObj.move.x = e.changedTouches[0].clientX;
			},
			swipeEnd() {
				let touch = this.swipeObj.move,
					offsetX = touch.x > 0 ? touch.x - this.swipeObj.x : 0;

				if (Math.abs(offsetX) >= 60) {
					offsetX < 0 ? this.playSong('next') : this.playSong('prev');
				}
				// clear swipe obj
				this.swipeObj.start = this.swipeObj.move = {};
			}
		}
	};
</script>

<style lang="sass">
	.fixed-wrapper {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 3;
		overflow: hidden;
		.song-cover {
			display: flex;
			flex: 1;
			align-items: center;
			height: 56px;
			overflow: hidden;
			.name-desc {
				overflow: hidden;
				padding-left: 7px;
				font-size: 14px;
				p {
					@include font-ellipsis;
				}
				p:first-child {
					font-size: 14px;
					color: $black-base-font;
				}
				p:last-child {
					margin-top: 5px;
					color: $gray-light-font;
				}
			}
			.song-album-img {
				display: block;
				max-width: 100%;
				width: 45px;
				height: 45px;
				border-radius: 50%;
			}
		}
		.mint-cell-value {
			overflow: hidden;
		}
		.play-wrapper {
			display: flex;
			align-items: center;
			.circle-wrapper {
				position: relative;
			    width: 28px;
			    height: 28px;
			    border: 2px solid $primary-color;
			    border-radius: 50%;
				.progress-circle {
				    transform: rotate(-90deg);
				}
				.progress-circle-prog {
				    fill: none;
				    stroke: $primary-color;
				    stroke-width: 2px;
				    stroke-dasharray: 0, 70;
				    transition: stroke-dasharray 0.7s linear 0s;
				} 
				.play-icon {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					width: 16px;
				}
			}
			.list-icon {
				margin-left: 16px;
				width: 24px;
				height: 24px;	
			}
		}
	}
</style>