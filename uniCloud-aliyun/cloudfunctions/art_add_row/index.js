'use strict';
const db=uniCloud.database()
exports.main = async (event, context) => {
	let {detail,pictures,collectionName}=event;
	//return detail从前端收集来再返回给前端
	
	return await db.collection(collectionName).add({
		posttime:Date.now(),
		pictures,
		
		...detail//对对象进行解构，展开对象
	})


};
