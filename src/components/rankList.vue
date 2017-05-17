<template>
	<div class="page">
		<mt-header fixed class="music-header-2">
	      <fallback slot="left"></fallback>
	      <span slot="right" style="font-size: 30px;font-weight: bold;display: inline-block;margin-top: -10px;">...</span>
	    </mt-header>
	    
	    <div class="page-content" ref="scrollView">
	    	<div class="music-cover-wrap">
		    	 <div class="music-cover" :style="`background-image:url(${topinfo.pic_album})`"></div>
		    	 <div class="title-wrap">
		    	 	<p class="main-title" v-if="topinfo.ListName">{{ topinfo.ListName }} 第{{ data.update_time | getDayOfYear }}天</p>
		    	 	<p class="minor-title" v-if="data.update_time">{{ data.update_time }}更新</p>
		    	 </div>
		    	 <div class="cover-overlay"></div>
		    </div>
	    	<!-- <div class="song-cotainer" v-if="songlist.length"> -->
	    	<div class="song-cotainer" v-if="1" ref="songContainer">
	    		<div class="song-slide-wrapper">
	    			<mt-navbar :value="selected" @input="function(val) {selected = val}">
					  <mt-tab-item id="1">单曲</mt-tab-item>
					  <mt-tab-item id="2">详情</mt-tab-item>
					  <mt-tab-item id="3">歌词本</mt-tab-item>
					</mt-navbar>
					<mt-tab-container v-model="selected">
						<mt-tab-container-item id="1">
							<ul>
								<li>
									<mt-cell class="music-cell-type4">
										<a><img src="../assets/play.png" class="icon">随机播放全部</a>
										<div>
											<a><img src="../assets/download.png" class="icon">下载</a>
											<a style="margin-left: 10px;"><img src="../assets/choice.png" class="icon">多选</a>
										</div>
									</mt-cell>
								</li>
								<li v-for="(song, index) in songlist" 
									key="index"
								    @click="playMusic(songlist, index)">
									<mt-cell class="music-cell-type3">
										<div class="suffix">
											<p :style="index<3 && {color: '#FF4500'}">{{ index + 1}}</p>
											<p><img width="10" style="margin-right: 3px;" src="../assets/value-up.png">{{ song.in_count | convertListenCount }}</p>
										</div>
										<div class="song">
											<p>{{ song.data.songname }}</p>
											<p>{{ song.data.singer | spliceSinger }} · {{ song.data.albumname }}</p>
										</div>
										<span class="detail">···</span>
									</mt-cell>
								</li>
							</ul>
						</mt-tab-container-item>
						<mt-tab-container-item id="2">
							<p  v-html="topinfo.info" 
								style="color: rgba(0, 0, 0, .5); 
								padding: 0 15px;
								font-size: 14px;
								line-height: 22px;
								margin-top: 20px;"></p>
						</mt-tab-container-item>
						<mt-tab-container-item id="3">
						</mt-tab-container-item>
					</mt-tab-container>
	    		</div>
	    	</div>
	    	<div class="song-cotainer" v-else></div>
    	</div>
	</div>
</template>

<script>
	import fallback from './fallback.vue';
	import { apiHandler } from '@/api/index';
	import IScroll from 'iscroll/build/iscroll-probe';
		
	export default {
		name: 'rankList',
		created() {
			let self = this;
	        apiHandler({
	        	name: 'rankList',
	        	params: {
	        		topid: self.$route.params.id
	        	}
	        },(response) => {
		        self.topinfo = response.topinfo;
		        self.songlist = response.songlist;
		        self.data = response;
	        })
		},
		mounted() {
			let scroll = new IScroll(this.$refs.songContainer, {click: true, probeType: 3, });

			scroll.on('scroll', function() {
				console.log(this)
			});
			setTimeout(() => {
				scroll.refresh();
			}, 500);
		},
		data() {
			return {
				topinfo: {},
				data: {},
				songlist: [],
				selected: "1"
			};
		}
	}
</script>

<style lang="sass">
	.music-cover-wrap {
		position: relative;
		margin-top: -$header-height;
		z-index: 0;
		.music-cover {
			 width: 100%;
			 background-repeat: no-repeat;
			 background-size: cover;
			 &:after {
			 	display: block;
			 	content: '';
			 	padding-top: 70%;
			 }
		}
		.title-wrap {
			position: absolute;
			width: 100%;
			bottom: 10px;
			color: #ffffff;
			z-index: 3;
			.main-title, .minor-title {
				text-align: center;
				margin-top: 0;
				margin-bottom: 5px;
			}
			.main-title {
				font-size: 18px;
			}
			.minor-title {
				font-size: 14px;
			}
		}
		.cover-overlay {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			background-color: rgba(0, 0, 0, .7);
			z-index: 2;
		}
	}
	.song-cotainer {
		position: absolute;
		left: 0;
		right: 0;
		top: $header-height;
		bottom: 0;
		background-color: transparent;
		overflow: hidden;
		&:before {
			display: block;
			content: '';
			padding-top: calc(70% - 40px);
		}
	}
</style>