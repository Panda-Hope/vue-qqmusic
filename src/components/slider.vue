<template>
	<div class="slide-container">
		<div class="slide-wrapper" ref="wrapper"
			 @touchstart="_swipeStart"
			 @touchmove="_swipeMove"
			 @touchend="_swipeEnd">
			<div class="slide-item" :style="opacityObj">
				<slot></slot>
				<ul class="indicator-wrapper">
					<li :class="current == 'center' && 'active'"></li>
					<li :class="current == 'right' && 'active'"></li>
				</ul>
			</div>
			<div class="slide-item right" :style="styleObj">
				<slot name="right"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	/* ================================================
	 * 				QQ 音乐滑动组件，
	 * 原理简介：
	 *	 参考 Vue-slider(https://github.com/warpcgd/vue-slider)
	 *   通过对于Touch Event 分析改变Page的 Transform, 同时通过
	 *   PreventDefault 优化Safari下的滑动效果。
	 * ================================================ */
    import { preventDefault, floatNumber } from '../util';
	const basicObject = {
		'transition-duration': '300ms',
		'transition-timing-function': 'ease'
	};

	export default {
		name: 'slider',
		props: {
			scrollSpeed: {
				type: Number,
				default: 2
			},
			outFactor: {
				type: Number,
				default: 0.3
			}
		},
		mounted() {
			this._init();
		},
		data() {
			return {
				current: 'center',
				opacity: 1,
				pageX: '',
				pageWidth: '',
				startPoint: {
					x:0, 
					y: 0,
					time: ''
				},
				lastPoint: {
					x: 0,
					y: 0,
					time: 0
				},
				_preventMove: false,
				_firstTouchMove: false
			};
		},
		computed: {
			styleObj() {
				return {
					transform: `translate3d(${this.pageX}px,  0, 0)`,
					...basicObject
				};
			},
			opacityObj() {
				return {
					opacity: this.opacity,
					transition: 'opacity ease 300ms'
				};
			}
		},
		methods: {
			_init() {
				this.pageX = this.pageWidth = this.$refs.wrapper.clientWidth;
			},
			_swipeStart(e) {
				let point = e.targetTouches[0];
				document.addEventListener('touchmove', preventDefault, {
					passive: false
				});
				
				this.startPoint.x = point.clientX;
				this.startPoint.y = point.clientY;
				this.startPoint.time = Date.now();
				this._firstTouchMove = true;
			},
			_swipeMove(e) {
				let point = e.targetTouches[0],
					offsetX = floatNumber(point.clientX - (this.lastPoint.x || this.startPoint.x), 2),
					offsetY = floatNumber(point.clientY - (this.lastPoint.y || this.startPoint.y), 2);

				 //store as the last point
				this.lastPoint.x = point.clientX;
				this.lastPoint.y = point.clientY;
				this.lastPoint.time = Date.now();

				if (this._firstTouchMove) {
					let dDis = Math.abs(this.lastPoint.x - this.startPoint.x) - Math.abs(this.lastPoint.y - this.startPoint.y);
					if (dDis > 0) {
						this._preventMove = false;
					}else {
						this._preventMove = true;
					}
				}

				if (!this._preventMove) {
					switch(this.current) { 
						case 'right':  
							if (offsetX < 0) {
								offsetX *= this.outFactor;
							}
							break;
					}
					this.pageX += offsetX*this.scrollSpeed;
					this._transparent(floatNumber(Math.abs(this.pageX)/this.pageWidth, 2));
				}
			},
			_swipeEnd(e) {
				let point = this.lastPoint,
					pageWidth = this.pageWidth,
					deltaTime = Date.now() - this.startPoint.time,
					deltaDistance = point.x - this.startPoint.x;

				let whetherSwitch = Math.abs(deltaDistance) >= 60,
					direction = deltaDistance >= 0;

				document.removeEventListener('touchmove', preventDefault);
				this.lastPoint = {}; // clear the last Point
				switch(this.current) {
					case 'center':
						if (whetherSwitch && !direction) {
							this.pageX = 0;
							this._transparent(0);
							this.current = 'right';
						}else {
							this._transparent(1);
							this.pageX = pageWidth;
						}
						break;
					case 'right':
						if (whetherSwitch && direction) {
							this.pageX = pageWidth;
							this._transparent(1);
							this.current = 'center';
						}else {
							this._transparent(0);
							this.pageX = 0;
						}
						break;
				}
			},
			// transparent the center page
			_transparent(opacity) {
				this.opacity = Math.abs(opacity);
			}
		}
	}
</script>

<style lang="sass">
	.slide-container {
		display: flex;
		flex-wrap: wrap;
		position: relative;
		overflow: hidden;
		width: 100%;
		.slide-wrapper {
			display: flex;
			flex: 1;
			.slide-item {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				flex-shrink: 0;
				width: 100%;
				&.left, &.right {
					position: absolute;
					left: 0;
					top: 0;
					right: 0;
					bottom: 0;
				}
				&.left {
					transform: translate3d(-100%, 0, 0);
				}
				&.right {
					transform: translate3d(100%, 0, 0);
				}
			}
		}
		.indicator-wrapper {
			display: flex;
			justify-content: center;
			width: 100%;
			height: 10px;
			>li:not(:last-child) {
				margin-right: 5px;
			}
			> li {
				&.active {
					background-color: $white-base;
				}
				width: 8px;
				height: 8px;
				border-radius: 50%;
				background-color: rgba(255, 255, 255, .6);
			}
		}
	}
</style>