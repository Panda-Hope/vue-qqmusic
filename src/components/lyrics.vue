<template>
	<div class="lyrics-wrapper" 
		 ref="lyricsWrapper" 
		 @touchstart="scrollAbled = false" 
		 @touchend="scrollAbled = true">
		<div class="lyrics">
			<p v-for="(item, key) in lyricsArr" 
			   v-if="item"
			   :class="key == lyricIndex && 'gradient'"
			   :style="key == lyricIndex && lyricObj">{{ item }}</p>
		</div>
	</div>
</template>

<script>
	/* =========================================================================
	 * 					     歌词轮播组件
	 * 已完成功能：
	 *   1： 歌词随播放进度自动滚动
	 * 已完成UI：
	 *	 1： 当前播放歌词字体颜色随歌曲进度变化 
	 * 原理简介：
	 *	 通过QQ音乐API获取歌词信息，然后将歌词解码。通过
	 *	 lyricsAnalysis函数将歌词信息分解成时间、单个歌词、单句歌词耗时三个数组。
	 *   歌词颜色部分采用 background-image: linear-gradient 来染色(详情可参考：
	 *   https://css-tricks.com/snippets/css/gradient-text/)
	 *   由于CSS3 Transition并不支持此属性因此采用Tween.js (https://github.com/tweenjs/tween.js)
	 *   来执行属性变化的计算，并通过Window.requestAnimationFrame来优化，但是这样做需要在
	 *	 短时间内执行大量的DOM操作，因此这个效果仍然会带来大量的内存消耗
	 * ========================================================================= */
	import TWEEN from '@tweenjs/tween.js';
	import AlloyTouch from 'alloytouch';
	import Transform from 'css3transform';
	import { mapState, mapMutations } from 'vuex';
	const NameSpace = 'playing';

	export default {
		name: 'lyrics',
		mounted() {
			// initialize scroll effects
			this._initScroll();
		},
		data() {
			return {
				lyrics: {
					linearGradient: 0
				},
				alloyTouch: {},
				scroll: {},
				// lineHeight: 42,
				scrollAbled: true // stop scroll to element when touch 
			};
		},
		computed: {
			...mapState(NameSpace, ['songState']),
			lyricIndex() {
				return this.songState.currentLyricIndex;
			},
			lyricDuration() {
				return this.songState.currentLyricDuration;
			},
			lyricsArr() {
				return this.songState.currentLyricArr;
			},
			lyricObj() {
				let linearGradient = this.lyrics.linearGradient;
				return {
					'background-image': `-webkit-linear-gradient(left,rgb(49, 194, 124) ${linearGradient}%,#ffffff ${linearGradient}%)`
				};
			}
		},
		watch: {
			lyricIndex() {
				// modify the current lyric linear-gradient value
				let lyrics = this.lyrics;
				lyrics.linearGradient = 0; // reset progress

				new TWEEN.Tween(lyrics)
				.to({
					linearGradient: 100
				}, this.lyricDuration*1000)
				.start();

				animate();
				function animate() {
					requestAnimationFrame(animate);
					TWEEN.update();
				}

				// according the index scroll current lyric element
				this.scrollAbled && this._scrollToElement();
			}
		},
		methods: {
			_initScroll() {
				let scrollTouch = this.$refs.lyricsWrapper,
					scrollTarget =  scrollTouch.children[0];
					
				Transform(scrollTarget, true)
				this.alloyTouch = new AlloyTouch({
					touch: scrollTouch,
					target: scrollTarget,
					sensitivity: .8,
					initialValue: scrollTouch.offsetHeight/2 >> 0,
					bindSelf: true,
					max: 0,
					min: -scrollTarget.offsetHeight,
					// step: this.lineHeight,
					property: 'translateY'
				});
			},
			_scrollToElement() {
				let scrollTouch = this.$refs.lyricsWrapper,
					scrollTarget = scrollTouch.children[0].children,
					currentLyric = scrollTarget[this.lyricIndex],
					offsetToCenter = scrollTouch.offsetHeight/2;
					
				this.alloyTouch.to(-currentLyric.offsetTop + offsetToCenter, 600); 
			}
		}
	};
</script>

<style lang="sass">
	.lyrics-wrapper {
		position: relative;
		height: 100%;
		overflow: hidden;
		.lyrics {
			display: flex;
			align-items: center;
			flex-direction: column;
			.gradient {
				-webkit-background-clip: text;
				-webkit-text-fill-color: transparent;
			}
			p {
			    line-height: 42px;
				text-align: center;
				font-size: 16px;
				color: rgba(255,255,255,.8);
			}
		}
	}
</style>