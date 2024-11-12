// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	_before: function () { // 通用预处理器

	},
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
}
// 云对象 Marker/index.js
exports.main = async (event, context) => {
  const db = uniCloud.database();
  const collection = db.collection('markers'); // 'markers' 是您的数据库集合名

  try {
    // 添加标记点数据到数据库
    await collection.add({
      lat: event.lat,
      lng: event.lng,
      // 其他需要存储的信息...
    });

    return {
      success: true,
      message: '数据上传成功',
    };
  } catch (e) {
    return {
      success: false,
      message: '数据上传失败',
      error: e,
    };
  }
};