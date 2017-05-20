<template>
	<div class="page">
		<mt-header fixed class="music-header" :title="title">
	      <fallback slot="left"></fallback>
	    </mt-header>
	    <div class="page-content">
	    	<iframe :src="url" ref="frame" class="special-frame" width="100%" height="100%"></iframe>
	    </div>
	</div>
</template>

<script>
	/* ==============================================
	 * 			    QQ音乐 特殊组件
	 *  此组件用于存放一些封面，专辑活动的QQ音乐原生的组件
	 *  而且这些页面在Iframe中经常会出现无法加载完成，暂未解决
	 * ============================================== */
	export default {
		name: 'special',
		mounted() {
			let url = this.$route.query.url;
			if (url) {
				this.url = decodeURIComponent(url);
				// console.log(this.$refs.frame.contentDocument)
				// this.title = this.$refs.frame.contentDocument.title;
			}
		},
		data() {
			return {
				title: 'QQ音乐',
				url: ''
			};
		}
	};
</script>

<style lang="sass">
	.special-frame {
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		border: none;
	}
</style>

