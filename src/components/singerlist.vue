<template>
	<div class="page">
		<mt-header fixed title="歌手" class="music-header">
	      <fallback slot="left"></fallback>
	    </mt-header>
		<div class="page-content">
			<mt-index-list v-if="singerlistAll.length">
			  <mt-index-section :index="itemAll.name"
			  					v-for="(itemAll, key) in singerlistAll"
			  					:key="key">
			  	<router-link v-for="(item, key) in itemAll.singerlist"
			  				 class="singer-list-item"
			  				 tag="li"
			  				 :key="key"
			  				 v-if="key < 20"
			  				 :to="{name: 'singer', params: {id: item.Fsinger_mid}}">
			  		<img class="avator" v-lazy="getAvator(item.Fsinger_mid)">
			  		<span>{{ item.Fsinger_name }}</span>
			  		<i class="icon"></i>
		  		</router-link>
			  </mt-index-section>
			</mt-index-list>
			<div class="singer-list-loading" v-else>
				<mt-spinner type="fading-circle"></mt-spinner><span style="color: #666">&nbsp;&nbsp;加载中...</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { apiHandler } from '@/api/index';

	const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
	 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	const loop = function() {
		let arr = [];

		letter.forEach(item => arr.push({
			name: item,
			index: item,
			singerlist: []
		}));
		return arr;
	};
	const singerlistArr = [
		{
			name: '热门',
			index: 'all',
			singerlist: []
		},
		...loop()
	];

	/* ==========================================
	 * 					歌手列表组件
	 *	Issue：
	 *		1：这里采用自己简化的Cell并不使用Mini的cell
	 *		来加快dom渲染的，当数据量2W时如果采用mini-ui
	 *		的Cell将会明显减慢渲染的速度
	 *		2：这里歌手的API有点小问题，经常产生一些错误
	 * ========================================== */
	export default {
		name: 'singerlist',
		mounted() {
			let i = 0,
				self = this,
				len = singerlistArr.length;
			/*
			 * 这里
			 * */
			let singerlistAll = singerlistArr;
			singerlistArr.forEach((item, index) => {
				apiHandler({
					name: 'singerlist',
					params: {
						key: `all_all_${item.index}`
					}
				}, response => {
					singerlistAll[index].singerlist = response.data.list || {};
					if (index >= singerlistArr.length -1) {
						setTimeout(() => {
							this.singerlistAll = singerlistAll;
						}, 500);
					}
				});
			});
		},
		data() {
			return {
				singerlistAll: {}
			};
		},
		methods: {
			getAvator(img) {
				// console.log(img)
				return img ? `https://y.gtimg.cn/music/photo_new/T001R300x300M000${img}.jpg?max_age=2592000` : '';
			}
		}
	};
</script>

<style lang="sass">
	.mint-indexlist-content {
		background-color: $white-base;
		.singer-list-item {
			position: relative;
			display: flex;
			align-items: center;
			padding: 5px 20px;
			background-image: linear-gradient(180deg, #eae7e7, #eae7e7 50%, transparent 50%);
			background-size: 120% 1px;
		    background-repeat: no-repeat;
		    background-position: bottom left;
			.avator {
				width: 45px;
				height: 45px;
				margin-right: 15px;
				border-radius: 50%;
			}
			.icon {
				position: absolute;
			    right: 10px;
			    top: 50%;
			    margin-top: -4px;
			    width: 10px;
			    height: 10px;
			    border-right: 1px solid #666;
			    border-bottom: 1px solid #666;
			    -webkit-transform: rotate(-45deg);
			}
		}
	}
	.singer-list-loading {
		display: flex;
		align-items: center;
		justify-content: center;
	    position: absolute;
	    z-index: -1;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    top: 0;
	}
</style>
