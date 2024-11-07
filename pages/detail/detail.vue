<template>
	<view class="detail">
		<view class="container">

			<view v-if="loadState">
				<u-skeleton rows="5" title loading></u-skeleton>
			</view>
			<view v-else>
				<view class="title">{{detailObj.title}}</view>
				<view class="userinfo">
					<view class="avatar">
						<cloud-image :src="detailObj.user_id[0].avatar_file?detailObj.user_id[0].avatar_file.url:'../../static/logo.png'" mode="aspectFill" width="60rpx" height="60rpx"></cloud-image>
					</view>
					<view class="text">
						<view class="name">
							{{detailObj.user_id[0].nickname?detailObj.user_id[0].nickname:detailObj.user_id[0].username}}
						</view>
						<view class="small">
							<uni-dateformat :date="detailObj.publish_date"
								format="yyyy年MM月dd hh:mm:ss"></uni-dateformat> · 发布于{{detailObj.province}}
						</view>
					</view>
				</view>
				<view class="content">
					<u-parse :content="detailObj.content" :tagStyle="tagStyle"></u-parse>
				</view>


				<view class="like">
					<view class="btn" @click="clickLike()" :class="detailObj.islike?'active':''">
						<text class="iconfont icon-good-fill"></text>
						<text v-if="detailObj.like_count">{{detailObj.like_count}}</text>
					</view>
					<view class="users">
						<template v-for="item in likeUserArr">
							
							<image :src="item.user_id[0].avatar_file?'https://env-00jxge6l72td.normal.cloudstatic.cn/'+item.user_id[0].avatar_file.name:''" mode="aspectFill"></image>
							
						</template>
					</view>
					<view class="text"><text class="num">{{detailObj.view_count}}</text>人看过</view>
				</view>
			</view>


		</view>

		<view class="comment">
			<view style="padding-bottom:50rpx" v-if="!commentList.length && noComment">
				<u-empty mode="comment" icon="https://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view>

			<view class="content" v-if="commentList.length">
				<view class="item" v-for="item in commentList">
					<comment-item :item="item" @removeEnv="PremoveEnv"></comment-item>
				</view>
			</view>
		</view>

		<comment-frame :commentObj="commentObj" @commentEnv="PcommentEnv"></comment-frame>

	</view>
</template>

<script>
	import{
		store,
		mutations
	}from'@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	const utilsObj=uniCloud.importObject("utilsObj",{
		customUI:true//不出现加载中
	})
	export default {

		data() {
			return {
				artid: "",
				loadState: true,
				tagStyle:{
					p:"line-height:1.7em;font-size:16px;padding-bottom:10rpx",
					img:"margin:10rpx 0"},
				likeUserArr: [],
				commentObj:{
					article_id:"",
					comment_type:0
				},
				commentList: [],
				detailObj: null,
				noComment:false
			};
		},
		onLoad(e) { //从onLoad拿到id参数
			//console.log(e)
			if(!e.id){
				this.errFun()
				return;
			}
			this.artid = e.id
			this.getData()
			this.readUpdate()
			this.getLikeUser()
		},
		methods: {
			
			
			//点赞操作
			
			async clickLike(){
				
				let time=Date.now()
				if(time-this.likeTime<2000){
					uni.showToast({
						title:"操作太频繁，请稍后...",
						icon:"none"
					})
					return
				}
				if(store.hasLogin){
					this.likeTime=time
					//先用前端解决点赞数，网络请求界面有延迟
					
					this.detailObj.islike?this.detailObj.like_count--:this.detailObj.like_count++
					this.detailObj.islike=!this.detailObj.islike
				}
				
				//调用点赞方法
				this.likeFun()
				
			},
			
			//点赞操作数据库的方法
			async likeFun(){
				let count=await db.collection("quanzi_like")
					.where(`article_id=="${this.artid}"&&user_id==$cloudEnv_uid`).count()
				//	console.log(count)
					if(count.result.total){
						db.collection("quanzi_like").where(`article_id=="${this.artid}"&&user_id==$cloudEnv_uid`)
						.remove()
						utilsObj.operation("quanzi-articles","like_count",this.artid,-1)//总的点赞数
					}else{
						db.collection("quanzi_like").add({
							article_id:this.artid
						})
						utilsObj.operation("quanzi-articles","like_count",this.artid,1)
					}
			},
			//修改阅读量
			readUpdate(){
				utilsObj.operation("quanzi-articles","view_count",this.artid,1).then(res=>{
					//console.log(res)
				})
			},
			
			//获取部分点赞的用户
			getLikeUser(){
				let likeTemp= db.collection("quanzi_like").where(`article_id == "${this.artid}"`).getTemp()
				let userTemp= db.collection("uni-id-users").field("_id,avatar_file").getTemp()
				db.collection(likeTemp,userTemp).orderBy("publish_date desc").limit(5).get().then(res=>{
					//console.log(res);
					res.result.data=res.result.data.reverse()
					this.likeUserArr=res.result.data
					console.log(this.likeUserArr[0].user_id[0].avatar_file)
					
				})
			},
			//错误处理
			errFun(){
				uni.showToast({
					title:"参数有误",
					icon:"none"
				})
				setTimeout(()=>{
					uni.reLaunch({
						url:"/pages/index/index"
					})
				},1000)
			},
			
			getData() {
				let artTemp = db.collection("quanzi-articles").where(`_id=="${this.artid}"`).getTemp() //创建临表
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()
				let likeTemp=db.collection("quanzi_like").where(`article_id=="${this.artid}"&&user_id==$cloudEnv_uid`)
				.getTemp()
				let tempArr=[artTemp, userTemp]
				if(store.hasLogin) tempArr.push(likeTemp)
				db.collection(...tempArr).get({ //联表查询
					getOne: true
				}).then(res => {
					//console.log(res)
					
					if(!res.result.data){
						this.errFun()
						return
					}
					
					this.loadState=false
					let islike
					if(store.hasLogin)islike = res.result.data._id.quanzi_like.length?true:false
						
					
					res.result.data.islike=islike
					this.detailObj = res.result.data
					// console.log(res)
					// console.log(this.detailObj)
					uni.setNavigationBarTitle({
						title:this.detailObj.title
					})
				}).catch(err=>{
					this.errFun()
				})
				
			}
		}

	}
</script>

<style lang="scss">
	.detail {
		background: #f8f8f8;
		min-height: calc(100vh - var(--window-top));

		.container {
			padding: 30rpx;
			background: #fff;

			.title {
				font-size: 46rpx;
				color: #333;
				line-height: 1.4em;
				font-weight: 600;
			}

			.userinfo {
				padding: 20rpx 0 50rpx;
				display: flex;
				align-items: center;

				.avatar {
					width: 60rpx;
					height: 60rpx;
				//	padding-right: 15rpx;
					margin-right: 15rpx;
					border-radius: 50%;		
					overflow: hidden;
				}

				.text {
					font-size: 28rpx;
					color: #555;
					

					.small {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			.content {}

			.like {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 80rpx 50rpx 50rpx;

				.btn {
					width: 260rpx;
					height: 120rpx;
					background: #e4e4e4;
					border-radius: 100rpx;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					font-size: 28rpx;

					.iconfont {
						font-size: 50rpx;
					}

					&.active {
						background: #13742F;
					}
				}

				.text {
					font-size: 26rpx;
					color: #666;

					.num {
						color: #13742F
					}

					.spot {
						padding: 0 10rpx;
					}
				}

				.users {
					display: flex;
					justify-content: center;
					padding: 30rpx 0;

					image{
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
						border: 3px solid #fff;
						margin-left: -20rpx;
					}
				}
			}

		}

		.comment {
			padding: 30rpx;
			padding-bottom: 120rpx;

			.item {
				padding: 10rpx 0;
			}
		}



	}
</style>