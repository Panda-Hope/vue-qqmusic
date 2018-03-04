<template>
  <div class="page">
    <mt-header fixed title="排行" class="music-header">
      <fallback slot="left"></fallback>
    </mt-header>
    <div class="page-content">
      <ul class="music-list">
        <li>
          <mt-cell title="Q Q 音 乐 巅 峰 榜"  class="music-cell-type1"></mt-cell>
        </li>
        <router-link
          tag="li"
          :to="{name: 'rankList', params: { id: item.id }}"
          v-for="item in topList"
          :key="item.id" >
          <mt-cell  class="music-cell-type2">
            <!-- <img :src="item.picUrl" width="100" hei="100"> -->
            <div class="listen-cover">
              <img v-lazy="item.picUrl">
              <span class="listen-count">
                <i class="listen-icon"></i>
                {{ item.listenCount | listenFormat }}万
              </span>
              <i class="listen-play"></i>
            </div>
            <ul slot="title" class="song-list">
              <!-- <li class="song-title">{{ item.topTitle }}</li> -->
              <li v-for="(song, index) in item.songList" :key="index" class="song-item">
                {{ index+1 }}
                {{ song.songname}}
                <span class="song-singer">{{ '- '+song.singername }}</span>
              </li>
            </ul>
            <i slot="right" class="song-arrow"></i>
          </mt-cell>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
  import { apiHandler } from '@/api/index';
  import fallback from './fallback.vue';

  export default {
    name: 'topList',
    created() {
      let self = this;
      apiHandler('topList', (response) => {
        self.topList = response.data.topList;
      })
    },
    data() {
      return {
        topList: {}
      };
    }
  };
</script>

<style lang="sass">
  .music-list {
    > li {
      margin: 0 10px 10px;
    }
  }
</style>
