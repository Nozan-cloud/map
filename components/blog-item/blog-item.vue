<template>
	<view class="blogitem">
		<view class="head">
			<view class="userinfo">
				<view class="avatar">
					<cloud-image 
					:src="item.user_id[0].avatar_file?item.user_id[0].avatar_file.url:'../../static/image/我的 (1).png'"  
					mode="aspectFill" width="50rpx" height="50rpx"></cloud-image>
				</view>
				<view class="name">
					{{item.user_id[0].nickname?item.user_id[0].nickname:item.user_id[0].username}}
				</view>
				<view class="time">
					<uni-dateformat :date="item.publish_date" format="MM月dd hh:mm" :threshold="[60000,3600000*24*30]"></uni-dateformat>
				</view>
			</view>
			
			<view class="more" @click="clickMore">
				<text class="iconfont icon-ellipsis"></text>
			</view>
		</view>
		
			
		<view class="body">
			<view class="title" @click="goDetail()">{{item.title}}</view>
			<view class="text" @click="goDetail()">
				<view class="t">{{item.description}}</view>
			</view>
			<view class="piclist">
				<view class="pic" :class="item.pictures.length==1 ? 'only': ''" v-for="(pic,index) in item.pictures" 
				:key="pic" @click="clickPic(index)">
					<image :src="pic" mode="aspectFill"></image>
				</view>					
			</view>
		</view>

		<view class="info">
			<view class="box">
				<text class="iconfont icon-a-27-liulan"></text> 
				<text>{{item.view_count}}</text>
			</view>
			<view class="box">
				<text class="iconfont icon-a-5-xinxi"></text> 
				<text>{{item.comment_count?item.comment_count:'评论'}}</text>
			</view>
			<view class="box">
				<text class="iconfont icon-a-106-xihuan"></text> 
				<text>{{item.like_count?item.like_count:'点赞'}}</text>
			</view>
		</view>
		
		<u-action-sheet :actions="list" cancelText="取消" :show="sheetShow" 
			:closeOnClickOverlay="true" :closeOnClickAction="true" 
			@select="sheetSelect"
			@close="onClose"
			></u-action-sheet>
	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		name:"blog-item",
		props:{
			item:{
				type:Object,
				default(){
					return{
						//返回空对象
					}
				}
			}
		},
		data() {
			return {
				sheetShow:false,
				list:[
					{
						name:"修改",
						type:"edit",
						disabled:true
					},
					{
						name:"删除",
						type:"del",
						color:"#F56C6C",
						disabled:true
					}
					
				]
			};
		},
		methods:{
			
			//点击更多操作
			clickMore(){
				let uid=uniCloud.getCurrentUserInfo().uid
				if(uid == this.item.user_id[0]._id || this.uniIDHasRole('admin') || this.uniIDHasRole('webmaster')){
					this.list.forEach(item=>{
						item.disabled=false
					})
				}
				this.sheetShow=true;
			},
			
			//点击选择
			sheetSelect(e){				
				this.sheetShow=false
				let type=e.type;
				console.log(type);
				
				if(type=="del"){
					
					this.delFun();
				}
			},
			delFun(){
				uni.showLoading({
					title:"加载中..."
				})
				db.collection("quanzi-articles").doc(this.item._id).remove({

				}).then(res=>{					
					uni.hideLoading();
					uni.showToast({
						title:"删除成功",
						icon:"none"
					})	
					
					setTimeout(()=>{
						uni.reLaunch({
							url:"/pages/index/index"
						})
					},800)
					
				}).catch(err=>{
					uni.hideLoading()
				})
			},
			//取消弹窗
			onClose(){
				this.sheetShow=false
			},
			//单击图片
			clickPic(index){
				
				uni.previewImage({
					
					urls:this.item.pictures,
					current:index
				})
			},
			goDetail(){
			//	console.log(this.item)
				uni.navigateTo({
					url:"/pages/detail/detail?id="+this.item._id
				})
			}
			
		}
	}
</script>

<style lang="scss">
.blogitem{
	.head{
		display:flex;
		font-size: 32rpx;
		align-items: center;
		justify-content: space-between;
		.userinfo{
			display: flex;
			align-items: center;
			.avatar{ 
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				
				overflow: hidden;
				image{ 
					width: 100%;
					height: 100%;
					display: block;
				}
			}
			.name{				
				color:#222;				
				padding-left:10rpx;
			}
			.time{
				color:#888;
				font-size: 22rpx;
				padding-left:20rpx;
			}
		}
		.more{
			padding:5rpx;			
			.iconfont{ 
				font-size: 50rpx;
				color:#888;
			}
		}
	}
	
	
	
	.body{
		padding:15rpx 0 30rpx;
		.title{
			font-size: 44rpx;
			color:#000;
			font-weight: 600;	
			text-align: justify;
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;				
			text-overflow: ellipsis;		
			display: -webkit-box;			
			-webkit-line-clamp: 2;			
			line-clamp: 2;					
			-webkit-box-orient: vertical;	
		}
		.text{
			padding-top:10rpx;
			padding-bottom:10rpx;
			font-size: 30rpx;
			text-align: justify;
			color:#888;				
			.t{
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;				
				text-overflow: ellipsis;		
				display: -webkit-box;			
				-webkit-line-clamp: 2;			
				line-clamp: 2;					
				-webkit-box-orient: vertical;	
			}
		}
		.piclist{
			display: flex;
			padding-top:20rpx;
			.pic{
				width: 225rpx;
				height: 225rpx;
				margin-right: 6rpx;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}	
				&:first-child{
					border-radius: 20rpx 0 0 20rpx;					
				}
				&:last-child{
					border-radius: 0 20rpx 20rpx 0;					
				}
				&.only{
					border-radius: 20rpx;
				}
				
			}
			
		}
	}

	.info{
		display: flex;
		align-items: center;
		justify-content:space-around;
		font-size: 26rpx;	
		color:#333;
		.box{
			display: flex;
			align-items: center;			
			padding:15rpx 0 5rpx;
			flex:1;
			display: flex;
			justify-content: center;
			.iconfont{
				font-size: 40rpx;
				padding-right: 10rpx;
			}
		}
		.box.active{
			color:#0199FE
		}
		
	}
}
</style>