<template>
	<div class="list-view" :class="listclass">
		<div class="header">
			<div>
				<img class="order-icon" 
					 @click="switchPlayOrder" 
					 :src="require(`../assets/${playingOrder}-2.png`)">
				<span class="font" v-if="playingOrder == 'cycle'">顺序播放{{ songlist.length }}首</span>
				<span class="font" v-if="playingOrder == 'singleCycle'">单曲循环</span>
				<span class="font" v-if="playingOrder == 'random'">随机播放{{ songlist.length }}首</span>
			</div>
			<img class="rubbish" src="../assets/rubbish.png" @click="clearSongStack">
		</div>
		<ul>
			<li v-for="(item, key) in songlist" @click="playSong(key)">
				<mt-cell class="music-cell-type6" :class="{active: key == songState.currentIndex}" :key="key">
					<div class="name-wrap">
						<span>{{ item.data.songname }}</span>
						<span>{{ item.data.singer | spliceSinger }}</span>
					</div>
					<i class="icon-delete" 
					   @click="clearSong(key)"
					   style="background-image: url('/static/delete.png')"></i>
				</mt-cell>
			</li>
		</ul>
		<div class="close" @click="toggleShow">关闭</div>
		<div class="overlay" @click="toggleShow"></div>
	</div>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex';
	const NameSpace = "playing";

	export default {
		name: 'listview',
		computed: {
			...mapState(NameSpace, ['songlist', 'songState']),
			...mapState('list', {showlist: 'show', listclass: 'class'}),
			playingOrder() {
				return this.songState.playingOrder;
			}
		},
		methods: {
			...mapMutations(NameSpace, ['playSong', 'switchPlayOrder', 'stackSonglist']),
			...mapMutations('list', ['toggleShow']),
			...mapActions(NameSpace, ['playSong', 'clearSongStack', 'clearSong'])
		}
	};	
</script>

<style lang="sass">
	.list-view {
		&.dark {
			&, .header, .close, .mint-cell {
				color: $white-base;
				background-color: rgba(0, 0, 0, .7);
			}
			.mint-cell .name-wrap span {
				color: $white-base;
			}
		}
		z-index: 5;
		position: absolute;
		overflow: hidden;
		top: 30%;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: $white-base;
		> ul {
			position: absolute;
			top: 50px;
			left: 0;
			right: 0;
			bottom: 50px;
			overflow: auto;
			-webkit-overflow-scrolling: touch;
		}
		.header {
			display: flex;
			height: 50px;
			padding: 0 20px;
			align-items: center;
			justify-content: space-between;
			background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
		    background-size: 100% 1px;
		    background-repeat: no-repeat;
		    background-position: bottom;
			.order-icon {
				width: 30px;
			}
			.font {
				font-size: 16px;
			}
			.rubbish {
				width: 30px;
			}
		}
		.close {
			display: flex;
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 50px;
			background-color: $white-base;
			justify-content: center;
			align-items: center;
			background-image: linear-gradient(0deg, #d9d9d9, #d9d9d9 50%, transparent 50%);
		    background-size: 100% 1px;
		    background-repeat: no-repeat;
		    background-position: top;
		}
		.overlay {
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			z-index: -1;
		}
	}
</style>