<template>
	<view class="index">
		<u-tabs :list="navlist"
		:activeStyle="{
		color: '#303133',
		fontWeight: 'bold',
		transform: 'scale(1.08)'
		}"
		:inactiveStyle="{
		color: '#888',
		transform: 'scale(1)'
		}"
		lineColor="#13742F"
		@click="clickNav"
		></u-tabs>
		<view class="loadingState" v-show="loadState">
			<u-skeleton
				rows="4"
				title
				loading
			></u-skeleton>
		</view>
		
		
		
		<view class="content">
			<view class="item" v-for="item in datalist">
				<blog-item :item="item"></blog-item>
				
			</view>
		</view>
		<view class="goAdd" @click="goAdd()">
			<uni-icons type= "plusempty" size="30" color="white"></uni-icons>
		
		</view>
	</view>
</template>

<script>
	const db=uniCloud.database()
	export default {
		data() {
			return {
				navlist: [{
					name: '最新',
					type:"publish_date"
				}, {
					name: '热门',
					type:"view_count"
				},],
				datalist:[],
				navActive:0,
				loadState:true//骨架屏
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData(){
				let artTemp= db.collection("quanzi-articles").
				field("title,user_id,description,pictures,comment_count,like_count,view_count,publish_date").getTemp();
				//联表？
				let userTemp=db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp();
				db.collection(artTemp,userTemp).orderBy(this.navlist[this.navActive].type,"desc").get().then(res=>{
					//publish_date dec倒叙排列
					//console.log(res);
					this.datalist=res.result.data
					this.loadState=false//数据加载完，骨架屏消失
				})
			},
			clickNav(nav){
				this.loadState=true
				//console.log(nav)
				this.navActive=nav.index
				this.getData()
			},
			//点击跳转到新增页面
			goAdd(){
				uni.navigateTo({
					url:"/pages/edit/edit"
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	
.index{
	.loadingState{
		padding: 30rpx;
	}
	.content{
		
		.item{
			padding:30rpx;
			border-bottom:#F7F7F7 15rpx solid
		}
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
		bottom: 120rpx;
		box-shadow: 0 0 20rpx rgb(19,116,47);//偏移 x y 模糊值
}	
</style>
