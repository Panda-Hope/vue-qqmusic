export function getEncodingUrl(options) {
	let queryString = '',
		url = options.url,
		urlParams =Object(options.params)

	for (let key in urlParams) {
	    if (queryString) {
	        queryString += "&";
	    }
	    queryString += key + "=" + encodeURIComponent(urlParams[key]);
	}
	return url + '?' + queryString;
}

export function jsonp(url, callback) {
    let callbackName = 'jsonp1';

    window[callbackName] = function(data) {
        window[callbackName] = undefined;
        document.body.removeChild(script);
        callback(data);
    };

    let script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
}

let basicParams = {
	g_tk: 1604785682,
	uin: 494873674, // qq acount
	format: 'jsonp',
	inCharset: 'utf-8',
	outCharset: 'utf-8',
	notice: 0,
	platform:'h5',
	needNewCode: 1,
	jsonpCallback: 'jsonp1',
	_: new Date().getTime()
};

let apiList = {
	topList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg',
		params: basicParams
	},
	rankList: {
		url: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg',
		params: {
			...basicParams,
			type: 'top',
			page: 'detail',
			tpl: 3
		}
	},
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
	indexMsg: {
		url: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
		params: {
			...basicParams
		}
	},
	hotkey: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
		params: {
			...basicParams
		}
	},
	search: {
		url: 'https://c.y.qq.com/splcloud/fcgi-bin/smartbox_new.fcg',
		params: {
			...basicParams,
			is_xml: 0
		}
	}
};

// return a api handler that expose all api methods
export function apiHandler(api, callback) {
	return jsonp(getEncodingUrl(typeof api === 'string' ? apiList[api] : (apiList[api.name].params = Object.assign({}, apiList[api.name].params, api.params), apiList[api.name])), callback);
}

