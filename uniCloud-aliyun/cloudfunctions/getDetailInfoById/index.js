const db = uniCloud.database();
const $ = db.command.aggregate;

exports.main = async (event, context) => {
  const { poiId } = event; // 接收传入的参数，这里是 opendb-poi 表的 _id

  try {
    const res = await db.collection('opendb-poi').aggregate()
      .match({ _id: poiId }) // 匹配 opendb-poi 表中的 _id
      .lookup({
        from: 'detail-info',
        localField: '_id',
        foreignField: 'id',
        as: 'detailInfo'
      })
      .end();

    if (res.data.length === 0) {
      return {
        code: -1,
        msg: '未找到对应的地点信息'
      };
    }

    const poi = res.data[0]; // 找到的地点信息
    const detailInfo = poi.detailInfo[0]; // 对应的 detail-info 表中的信息

    return {
      code: 0,
      data: {
        address: detailInfo.address,
        image: detailInfo.image,
        otherInfo: detailInfo.otherInfo
      }
    };
  } catch (err) {
    console.error(err);
    return {
      code: -1,
      msg: '查询失败'
    };
  }
};
