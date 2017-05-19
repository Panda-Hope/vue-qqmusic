<template>
	<div class="page">
		<mt-header fixed 
				   title="音乐馆" 
				   class="music-header scroll-header" 
				   :style="searchVisible && {top: '-40px'}"></mt-header>
		<search-vue v-model="value" :visible.sync="searchVisible" :style="searchVisible && {top: '-40px'}"></search-vue>
		<div class="page-content" style="padding-top: 84px;">
			<swiper :options="swiperOption" ref="mySwiper">
				<swiper-slide v-for="(item, index) in indexMsg.slider" key="index">
					<img :src="item.picUrl" class="slider-item">
				</swiper-slide>
				<div class="swiper-pagination"  slot="pagination"></div>
			</swiper>
			<div class="recommend-wrapper">
				<p class="title">热 门 推 荐</p>
				<ul class="recommend-list">
					<li></li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import { apiHandler } from '@/api/index';
	import { swiper, swiperSlide } from 'vue-awesome-swiper';
	import searchVue from './search';

	export default {
		name: 'index',
		created() {
	      let self = this;
	      apiHandler('indexMsg', (response) => {
	        self.indexMsg = response.data;
	      })
	    },
		data() {
			return {
				indexMsg: {},
				value: '',			  // input value
				searchVisible: false, 
				searchPlacehoder: ['搜索', '搜索音乐、歌词、歌单、'],
				banners: [],
				swiperOption: {
		          autoplay: 5000,
		          initialSlide: 1,
		          loop: true,
		          pagination: '.swiper-pagination'
		        }
			};
		},
		methods: {
			// Switch Animation When Search Active State Changed
			_searchInput() {
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
	.recommend-wrapper {
		margin-top: 20px;
		.title {
			text-align: center;
			line-height: 48px;
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