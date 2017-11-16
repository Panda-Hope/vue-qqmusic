export function getEncodingUrl(options) {
	let queryString = '',
		url = options.url,
		uniqueName = 'jsonp' + new Date().getTime(),  // get unique jsonp callbackname, aviod callback bug at same time
		urlParams = {...options.params, jsonpCallback: uniqueName};

	for (let key in urlParams) {
	    if (queryString) {
	        queryString += "&";
	    }
	    queryString += key + "=" + encodeURIComponent(urlParams[key]);
	}
	return {
		url: url + '?' + queryString,
		jsonpCallback: uniqueName
	};
}

export function jsonp(urlObj, callback) {
    let url = urlObj.url,
    	callbackName = urlObj.jsonpCallback;

    window[callbackName] = function(data) {
        window[callbackName] = undefined;
        document.body.removeChild(script);
        callback(data);
    };

    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}


/* =============================================
 * 				 QQ音乐Api解析
 *	简介：
 *		将需要用到的API进行分析， 通过getEncodingUrl
 *		对URL进行组装，通过jsonp来执行跨域数据获取，
 *		最后通过 apiHandler 方法导出统一的接口
 * =============================================  */
let basicParams = {
	g_tk: 1604785682,
	uin: 494873674, // qq acount
	format: 'jsonp',
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: 0,
	platform:'h5',
	needNewCode: 1,
	// jsonpCallback: 'jsonp1',
	_: new Date().getTime()
};

let apiList = {
	// 音乐排行榜APi
	topList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
		params: basicParams
	},
	// 流行指数歌曲API
	rankList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
		params: {
			...basicParams,
			type: 'top',
			page: 'detail',
			tpl: 3
		}
	},
	// 推荐列表歌曲API
	recommend: {
		url: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
		params: {
			...basicParams,
			pic: 500,
			json: 1,
			type: 1,
			utf8: 1,
			nosign: 1,
			onlysong: 0,
			nosign: 1
		}
	},
	// 首页数据Api
	indexMsg: {
		url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
		params: {
			...basicParams
		}
	},
	// 热词搜索Api
	hotkey: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
		params: {
			...basicParams
		}
	},
	// 搜索API
	search: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
		params: {
			...basicParams,
			is_xml: 0
		}
	},
	// 全部歌手列表数据ApI
	singerlist: {
		url: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg',
		params: {
			...basicParams,
			page: 'list',
			channel: 'singer',
			pagesize: 100,
			hostUin: 0,
			needNewCode: 0,
			pagenum: 1
		}
	},
	// 歌手API
	singer: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
		params: {
			...basicParams,
			begin: 0,
			num: 30,
			order: 'listen',
			from: 'h5',
			songstatus: 1
		}
	}
};

// return a api handler that expose all api methods
export function apiHandler(api, callback) {
	return jsonp(getEncodingUrl(typeof api === 'string' ? apiList[api] : (apiList[api.name].params = Object.assign({}, apiList[api.name].params, api.params), apiList[api.name])), callback);
}

