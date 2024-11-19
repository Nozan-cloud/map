'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  // 从event中解构出集合名称和跳过的记录数
  let { collectionName, skip = 0 } = event;

  // console.log('Collection Name:', collectionName); // 输出集合名称

  // 返回数据给客户端
  // orderBy后发布的在前面
  // .limit(8)限制每页只有8条数据
  return await db.collection(collectionName).limit(8).skip(skip).orderBy("posttime", "desc").get(); // "desc降序排列，从大到小排列"
};