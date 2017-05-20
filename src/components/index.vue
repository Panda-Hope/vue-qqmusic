<template>
	<div class="page">
		<mt-header fixed 
				   title="音乐馆" 
				   class="music-header scroll-header" 
				   :style="searchVisible && {top: '-40px'}"></mt-header>
		<form @submit="searching">
			<search-vue v-model="searchValue" 
					    :visible.sync="searchVisible" 
					    :style="searchVisible && {top: '-40px', height: '100%',height: '100vh'}">
				<div class="hotkey-wrapper" v-if="searchState == 0">
					<p>热门搜索</p>
					<ul class="hotkey-list">
						<template v-for="(item, index) in hotkeys">
						    <template v-if="index == 0 ">
						    	<li class="speical" @click="goSpecial(item.url)">{{ item.k }}</li>
						    </template>
						    <template v-else>
						    	<li @click="hoykeySearch(item.k)">{{ item.k }}</li>
						    </template>
					    </template>
					</ul>
				</div>
				<div class="result-list" v-if="searchState == 2">
					<mt-cell class="music-cell-type5" 
					         v-for="(item, index) in searchResult"
					         key="index"
					         @click.native="playSingleMusic(item)">
					    <i class="music-icon"></i>
					    <div class="song-wrapper">
					    	<p>{{ item.name }}</p>
						    <p>{{ item.singer }}</p>
					    </div>
					</mt-cell>
				</div>
		    </search-vue>
		</form>
		<div class="page-content" style="padding-top: 84px;">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide v-for="(item, index) in indexMsg.slider" key="index">
					<img :src="item.picUrl" class="slider-item" @click="goSpecial(item.linkUrl)">
				</swiper-slide>
				<div class="swiper-pagination"  slot="pagination"></div>
			</swiper>
			<ul class="radio-list">
				<li v-for="item in musiclist" @click="$router.push({name: item.route})">
					<img class="icon" :src="require(`../assets/${item.icon}`)">
					<span class="name">{{ item.name }}</span>
				</li>
			</ul>
			<div class="recommend-wrapper">
				<p class="title">热 门 推 荐</p>
				<ul class="recommend-list">

				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	/* ==========================================================
	 * 					 	QQ音乐 首页
	 *	已完成功能：
	 *		1： 歌曲搜索
	 *  Issuse： 
	 *		这里在搜索功能上有点问题， 由于QQ音乐Api的跨域限制无法获取
	 *		搜索结果改为获取临时的结果， 无法获取完成歌曲信息，因此缺少了封面
	 *		在这里欢迎大家提供更好的意见
	 * ========================================================== */
	import { apiHandler } from '@/api/index';
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import store from '../store';
	import { dealHotkey } from '../util';
	import searchVue from './search';

	// Vuex Playing Module NameSpace
	const NameSpace = 'playing';

	export default {
		name: 'index',
		created() {
	      apiHandler('indexMsg', (response) => {
	        this.indexMsg = response.data;
	        apiHandler('hotkey', (response) => {
		        this.hotkeys = dealHotkey(response.data);
		      });
	      });
	    },
		data() {
			return {
				indexMsg: {},
				searchVisible: false, 
				searchValue: '',	   // input value,
				searchState: 0,        // search input bar state 0: ready, 1: searching, 2: search result,
				searchResult: {},      // song search result
				banners: [],
				hotkeys: {},
				musiclist: [
					{
						icon: 'people.png',
						name: '歌手',
						route: ''
					},
					{
						icon: 'rank.png',
						name: '排行',
						route: 'topList'
					},
					{
						icon: 'radio.png',
						name: '电台',
						route: ''
					}
				],
				swiperOption: {
		          autoplay: 5000,
		          initialSlide: 1,
		          loop: true,
		          pagination: '.swiper-pagination'
		        }
			};
		},
		methods: {
			// searching the song by the hotkey
			hoykeySearch(hotkey) {
				this.searchValue = hotkey;
				this.searching();
			},
			searching(e) {
				e && e.preventDefault();
				let searchValue = this.searchValue;
				this.searchState = 1; // searching

				apiHandler({
					name: 'search',
					params: {
		        		key: searchValue
		        	}
				}, response => {
					this.searchState = 2; // search result
					this.searchResult = response.data.song.itemlist || [];
				});
			},
			// 用于搜索页面歌曲播放，由于QQ音乐搜索API跨域限制这里无法获取到封面信息
			playSingleMusic(song = {}) {
				let songObj = {
					data: {
						songid: song.id,
						songname: song.name,
						singer: [{
							name: song.singer
						}]
					}
				};
				store.commit(NameSpace + '/stackSonglist', [songObj]);
				store.dispatch(NameSpace + '/playSong', songObj);
			}
		},
		watch: {
			searchVisible(visible) {
				if (!visible) {
					this.searchState = 0;
					this.searchResult = [];
				}
			},
			searchState(state) {
				if (state == 1) {
					this.$indicator.open(`正在搜索${this.searchValue}`);
				}else {
					this.$indicator.close();
				}
			}
		},
		components: {
			swiper,
			swiperSlide,
			searchVue
		}
	};
</script>

<style lang="sass">
	.scroll-header {
		transition: top .5s ease;
	}
	.swiper-container {
			.slider-item {
			@include img-responsive;
		}
		.swiper-pagination-bullet-active {
			background: $white-base;
		}
	}
	.hotkey-wrapper {
		padding: 20px;	
		p:first-child {
			font-size: 14px;
			color: rgba(0, 0, 0, 0.5);
			margin-bottom: 10px
		}
		.hotkey-list {
			display: flex;
			flex-wrap: wrap;
			> li {
				font-size: 14px;
				margin-right: 5px;
				margin-bottom: 10px;
				text-align: center;
				padding: 0 10px;
			    height: 30px;
			    line-height: 30px;
				border-radius: 16px;
				border: 1px solid $base-line-color;
				&.speical {
					border-color: $primary-color;
					color: $primary-color;
				}
			}
		}
	}
	.radio-list {
		display: flex;
		justify-content: space-bewteen;
		padding: 20px;
		> li {
			display: flex;
			flex: 1;
			justify-content: center;
		    align-items: center;
			.icon {
				display: inline-block;
				width: 30px;
				height: 30px;
				margin-right: 10px;
			}
			.name {
				font-size: 14px;
			}
		}
	}
	.recommend-wrapper {
		.title {
			text-align: center;
			line-height: 48px;
			font-size: 20px;
		}
		.recommend-list {
			display: flex;
			flex-wrap: wrap;
			> li {
				flex: 1;

			}
		}
	}
</style>