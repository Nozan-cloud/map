//获取富文本内的图片url地址
export function getImgSrc(richtext,num=3) {
	let imgList = [];
	richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		  imgList.push(capture);
	});
	imgList=imgList.slice(0,num)
	return imgList;
}

export function getProvince(){
	return new Promise((resolve,reject)=>{//new实例化一个对象然后return
		let historyProvince = uni.getStorageSync("historyProvince")
		if(historyProvince){
			resolve(historyProvince.province)
		}
		else{
			//网络请求
			uni.request({
				url:"https://restapi.amap.com/v3/ip?key=90b100e70d67bf283e8a701721c554ba",
				success: (res) => {//回调
					let str=typeof(res.data.province)=="string"?res.data.province:"火星"
					resolve(str)//成功的回调使用resolve进行返回
					let obj={
						province:str,
						time:Date.now()
					}
					uni.setStorageSync("historyProvince",obj)
				},
				fail: (err) => {
					reject//失败的话抛出
				}
			})
		}
		
	})
}
