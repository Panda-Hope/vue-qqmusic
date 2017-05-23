import Vue from 'vue';
import { 
	padString, 
	getDayOfYear, 
	spliceSinger, 
	convertListenCount, 
	timeFormat } from './util';

// 格式化音乐听众数据
Vue.filter('listenFormat', val => {
	return padString(val, -4, '.', 0, 1);
});

// 获取当日为今年的第几年
Vue.filter('getDayOfYear', getDayOfYear);

// 拼接歌手名称 
Vue.filter('spliceSinger', spliceSinger);

// 转化听众数量为百分比
Vue.filter('convertListenCount', convertListenCount);

// 将秒数转化为时间值
Vue.filter('timeFormat', timeFormat);