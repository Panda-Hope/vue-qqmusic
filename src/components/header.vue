<template>
  <header
    class="mint-header"
    :class="{ 'is-fixed': fixed }">
    <div class="mint-header-button is-left">
      <slot name="left"></slot>
    </div>
    <transition name="title">
      <h1 class="mint-header-title" v-show="show" ref="titleWrap">
          <p :style="styleObj" ref="title">{{ title }}</p>
      </h1>
    </transition>
    <div class="mint-header-button is-right">
      <slot name="right"></slot>
    </div>
  </header>
</template>

<script>
/**
 * 重写Mini-UI Header 来实现更多自定义效果
 * 增加Title 切换动画和长标题自动滚动功能
 */
import TWEEN from '@tweenjs/tween.js';

export default {
  name: 'mt-header',
  props: {
    fixed: Boolean,
    title: String,
    showTitle: Boolean
  },
  data() {
    return {
      // If able to scroll
      ableFontScroll: false,
      translateX: 0,
      tween: '',
      // repeat content once
      count: 0
    };
  },
  computed: {
    show() {
      return this.showTitle;
    },
    styleObj() {
      return {
        transform: `translateX(${this.translateX}px)`,
      };
    }
  },
  watch: {
    show(now) {
      // delay 1000 ms when title animation complete
      let showTitle = now;
      if (showTitle) {
        setTimeout(() => {
          this.$nextTick(() => {
            let self = this,
                title = this.$refs.title || {},
                titleWrap = this.$refs.titleWrap || {},
                width = title.offsetWidth,
                tempWrapWidth = titleWrap.scrollWidth,
                wrapWidth;

            // judge if able to scroll
            if (tempWrapWidth > width) {
              let content = title.innerText;
              if (this.count == 0) {
                wrapWidth = title.scrollWidth;
                title.innerText = content + ' ' + content;
              }
              wrapWidth = title.scrollWidth/2;
              this.count++;
              
              // excute scroll animation
              function scrollTitle() {
                this.tween = new TWEEN.Tween({translateX: self.translateX})
                .to({translateX: -wrapWidth}, 8000)
                .onUpdate(function() {
                  self.translateX = this.translateX;
                })
                .onComplete(() => {
                  self.translateX = 0;
                  scrollTitle.call(self);
                })
                .start();

                requestAnimationFrame(animate);
                function animate(time) {
                  requestAnimationFrame(animate);
                  TWEEN.update(time);
                }
              }

              scrollTitle.call(this);
            }
          });
        }, 2000);
      }else {
        this.translateX = 0;
        this.tween && this.tween.stop();
      }
    }
  }
};
</script>
