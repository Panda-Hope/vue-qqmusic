<template>
	<div class="fallback">
		<i class="mintui mintui-back arrow" @click="bind(callback)"></i>
	</div>
</template>

<script>
	import { mapMutations } from 'vuex';
	
	export default {
		name: 'fallback',
		props: ['callback', 'transition'],
		methods: {
			bind(callback) {
				let go = this.fallback;
				// If Exists Callback Abort The Router Action And Excute The Callback
				typeof callback == 'function' ? this.callback(go) : go();
			},
			fallback() {
				this.$router.go(-1);
			},
			...mapMutations('transition', ['setTransition', 'setAction'])
		}
	};
</script>
