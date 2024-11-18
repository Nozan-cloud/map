<template>
	<view class="content">
		<view class="row" v-for="item in listArr" @click="goDetail(item._id)" :key="item._id">
			<newsbox :item="item"></newsbox>
		</view>
		<view class="goAdd" @click="goAdd()">
			<uni-icons type="plusempty" size="30" color="white"></uni-icons>
		
		</view>
		
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				db:'',
				listArr:[]
			}
		},
		onLoad(options) {
			this.db = options.db
			this.getData();
		},
		//触底方法
		onReachBottom() {
			this.getData();
		},
		onPullDownRefresh(){
			this.listArr=[];//清空处理，否则数据会重复
			this.getData();
			
		},
		methods: {
			//跳转到详情页
			goDetail(id){//拿到每一个页面的id
			    
				uni.navigateTo({
					url: `/pages/detailPages/detailPages?id=${id}`
				})
			},
			//获取数据库的列表
			getData()
			{
				uniCloud.callFunction({
					name:"art_get_all",
					data:{
						collectionName: this.db,
						skip:this.listArr.length
					}
				}).then(res=>{
					//console.log(res);
					let oldlist = this.listArr;
					let newlist = [...oldlist,...res.result.data];
					this.listArr=newlist;
					console.log(newlist)
					uni.stopPullDownRefresh();
				})
			},
			
			//点击跳转到新增页面
			goAdd(){
				uni.navigateTo({
					url:"/pages/allArt/add"
				})
				
			}

		}
	}
</script>

<style lang="scss">
	.content{
		padding: 30rpx;
		
		.row{
			border-bottom: 1px dotted #efefef;
			padding: 20rpx 0;
		}
	}
	.goAdd{
		width: 100rpx;
		height: 100rpx;
		background: #13742F;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		font-size: 60rpx;
		position: fixed;//位置固定
		right: 60rpx;
		bottom: 100rpx;
		box-shadow: 0 0 20rpx rgb(19,116,47);//偏移 x y 模糊值
	}
</style>
