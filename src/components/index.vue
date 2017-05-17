<template>
	<div class="page">
		<mt-header fixed title="音乐馆" class="music-header"></mt-header>
		<!-- <mt-search v-model="value"></mt-search> -->
		<div class="page-content">
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
				value: '',
				banners: [],
				swiperOption: {
		          autoplay: 5000,
		          initialSlide: 1,
		          loop: true,
		          pagination: '.swiper-pagination'
		        }
			};
		},
		components: {
			swiper,
			swiperSlide
		}
	};
</script>

<style lang="sass">
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