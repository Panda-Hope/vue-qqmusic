<template>
	<div class="page playing-container">
		<transition :css="false" @enter="_bounceDown" appear>
			<mt-header fixed class="music-header-3 playing-header" :title="songMsg.data.songname">
			  <span slot="left" @click="$router.go(-1)">
			  	<img src="../assets/arrow-down.png" width="26">
			  </span>
			  <span slot="right" style="font-size: 30px;font-weight: bold;display: inline-block;margin-top: -10px;">...</span>
		    </mt-header>
		</transition>
		<div class="content-wrapper">
			<slider>
				<div class="ablum-wrapper">
					<transition :css="false" @enter="_bounceDown" appear>
						<div class="title-wrap">
					    	<p>
					    		<img src="../assets/horizontal.png" width="18">
					    		<router-link tag="span" 
					    					 style="vertical-align: middle" 
					    					 :to="{name: 'singer', params: {id:songMsg.data.singer[0].mid}}">
					    			&nbsp;{{ songMsg.data.singer[0].name }}&nbsp;
					    		</router-link>
					    		<img src="../assets/horizontal.png" width="18">
					    	</p>
					    </div>
					   </transition>
					<img :src="ablumImgUrl" 
					     class="ablum" 
					     :class="{'spin': playingState != 'pause'}">
					<p class="lyric">{{ currentLyric }}</p>
				</div>
				<lyrics slot="right"></lyrics>
			</slider>
			<transition :css="false" @enter="_bounceUp" appear>
				<div class="play-wrapper">
					<div class="timer">
						<span>{{ playingCurrent | timeFormat }}</span>
						<div class="progress" ref="progress">
					    	<div class="progress-bar" :style="{width: playingPrgress*100 + '%'}"></div>
					    	<span @touchstart="startPrune"
					    		  @touchmove="movePrune" 
					    		  @touchend="endPurne"
					    		  class="progress-ball" 
					    		  :style="{left: playingPrgress*100 + '%'}"></span>
					    </div>
					    <span>{{ playTiming	| timeFormat }}</span>
					</div>
					<div class="play-control">
						<img :src="require(`../assets/${playOrder}.png`)" @click="switchPlayOrder" class="order-icon">
						<img @click="playSong('prev')" src="../assets/back.png" class="back-icon">
						<img @click="pause(playingState == 'pause' ? '' : 'pause')" 
							 :src="require(`@/assets/${this.songState.playingState == 'pause' ? 'play-2':'pause-2'}.png`)"
							 class="play-icon">
						<img @click="playSong('next')" src="../assets/prev.png" class="back-icon">
						<img src="../assets/list.png" class="list-icon" @click="toggleShow">
					</div>
				</div>
			</transition>
		</div>
		<div class="bgimg-blur" :style="{backgroundImage: `url(${ablumImgUrl})`}"></div>
		<div class="overlay"></div>
	</div>
</template>

<script>
	/* ==========================================
	 *                 音乐播放界面组件
	 * 已完成功能：
	 *   1： 音乐播放，暂停，下一首，上一首，
	 *	 2： 循环播放，单曲循环，随机播放
	 *   3： 歌曲列表删除
	 *	 4:  歌曲播放进度调整
	 * 已成完成UI：
	 *	 1： 歌手头像随音乐播放转动
	 *	 2： 进度条随播放进度自动滚动
	 *   3： 界面进入退出切换动画
	 *		 Issue: 这里原本是采用Animate.css, 但是发现在ios safari下无法使用于是改为采用Velocity.js
	 *		 来执行动画，详情请看：https://github.com/daneden/animate.css/pull/541
	 *   4： 歌词随播放进度滚动
	 * 播放原理简介：
	 *   采用Vuex统一管理当前播放歌曲信息、歌曲列表、
	 *   播放进度数据， 根据Vuex数据变化自动做出相应变化
	 * ========================================== */

	import { mapState, mapMutations, mapActions } from 'vuex';
	import Velocity from 'velocity-animate';
	const NameSpace = 'playing';

	export default {
		name: 'playing',
		// 更改主题颜色 ， 但是改了以后发现更加不好看了所以暂时注释掉
		// mounted() {
		// 	this.modifyClass('dark');
		// },
		// beforeDestroy() {
		// 	this.modifyClass('');
		// },
		data() {
			return {
				// progress bar touchstart x point
				touch: {
					startProgress: 0,
					width: 0,
					x: 0
				},
				lastTouch: {
					x: 0
				}
			};
		},
		computed: {
			...mapState(NameSpace, ['songMsg', 'songState']),
			playingState() {
				return this.songState.playingState;	
			},
			playingCurrent() {
				return this.songState.current;
			},
			playingPrgress() {
				return this.songState.playingProgress;
			},
			playTiming() {
				return this.songState.timing;	
			},
			playOrder() {
				return this.songState.playingOrder;
			},
			currentLyric() {
				return this.songState.currentLyricArr[this.songState.currentLyricIndex];
			},
			ablumImgUrl() {
				let albummid = this.songMsg.data.albummid;
				if (albummid) {
					return this.songMsg.songblum_prfix + albummid + '.jpg?max_age=2592000';
				}else {
					return 'https://y.gtimg.cn/mediastyle/mobile/app/share/img/music_logo.png?max_age=2592000&v=30cd379f7b9491439f2e8dcd6e1508b6';
				}
			}
		},
		methods: {
			...mapMutations(NameSpace, ['pause', 'switchPlayOrder', 'pruneCurrentTime']),
			...mapMutations('list', ['toggleShow',  'modifyClass']),
			...mapActions(NameSpace, ['playSong', 'pruneProgress']),
			startPrune(e) {
				this.pause('pause');
				this.touch.x = e.changedTouches[0].clientX;
				this.touch.startProgress = this.playingPrgress;
				this.touch.width = this.touch.width || this.$refs.progress.getBoundingClientRect().width;
			},
			movePrune(e) {
				e && e.preventDefault();
				let touch = e.changedTouches[0],
					offsetX = touch.clientX - this.touch.x;

				this.lastTouch.x = touch.clientX;
				this.pruneProgress(this.touch.startProgress + offsetX/this.touch.width);
			},
			endPurne() {
				let touch = this.lastTouch,
					offsetX = touch.x - this.touch.x;
				
				this.pruneCurrentTime(this.touch.startProgress + offsetX/this.touch.width);
				// play the music
				this.pause();
				// clear prune msg
				this.touch = {};
				this.lastTouch = {};
			},
			_bounceDown(el) {
				Velocity(el, {translateY: -800}, {duration: 0});
				Velocity(el, {translateY: [5, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400});
				Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100}).then(() => {el.removeAttribute('style')});
			},
			_bounceUp(el) {
				Velocity(el, {translateY: 800}, {duration: 0});
				Velocity(el, {translateY: [-20, [0.215, 0.610, 0.355, 1.000]]}, {duration: 400});
				Velocity(el, {translateY: [0, [0.215, 0.610, 0.355, 1.000]]}, {duration: 100});
			},
		},
		components: {
			slider: require('@/components/slider.vue'),
			lyrics: require('@/components/lyrics.vue')
			// lyrics(resolve) {
			// 	require(['@/components/lyrics.vue'], resolve);
			// }
		}
	};
</script>

<style lang="sass">
	.playing-container {
		z-index: 4;
		.bgimg-blur, .overlay {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			filter: blur(15px);
		}
		.bgimg-blur {
			z-index: -2;
			transform: scale(1.15);
			background-size: cover;
		    background-position: bottom center;
		}
		.overlay {
			z-index: -1;
			background-color: rgba(0, 0, 0, .4);
		}
		.content-wrapper {
			display: flex;
			align-items: space-around;
			flex-wrap: wrap;
			margin-top: 2.4rem;
			height: 100%;
			.ablum-wrapper {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
			    align-items: center;
			}
			.ablum-wrapper, .play-wrapper {
				flex-basis: 100%;
			}
		}
		.ablum-wrapper {
			.title-wrap {
				width: 100%;
				font-size: 14px;
				text-align: center;
				color: $white-base;
			}
			.ablum {
				@include img-responsive;
				@include center-auto;
				width: 88%;
				border-radius: 50%;
				border: 8px solid rgba(0, 0, 0, .3);
			}
			.lyric {
				width: 100%;
				height: 20px;
				line-height: 20px;
				color: $white-base;
				text-align: center;
				overflow: hidden;
			}
		}
		.play-control {
			display: flex;
			margin-top: 10px;
			padding: 0 20px;
			justify-content: space-between;
			align-items: center;
			.back-icon {
				width: 2rem;
				height: 2rem;
			}
			.play-icon {
				width: 3rem;
				height: 3rem;
			}
			.order-icon, {
				height: 1.5rem;
			}
			.list-icon {
				width: 1.25rem;
				height: 1.5rem;
			}
		}
	}
</style>
