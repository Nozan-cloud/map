<template>
	<view class="Box">
		<!-- 图片轮播 -->
		<swiper class="swiperBox" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="item in detailData.pictures" :key="item._id">
					<view class="swiper-item">
						<img :src="item.fileID" alt="" />
					</view>
				</swiper-item>
		</swiper>
		<view class="describBox">
			<view class="titleBox">
				<view class="begin"></view>
				<img src="../../static/image/marker.png" alt="" />
				<view class="title">
					{{ detailData.title }}
				</view>
			</view>
			<view class="summary">
				{{ detailData.content }}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				foodId:'',
				detailData:{}
			};
		},
		// 获取从上一个页面跳转过来的路由参数
		  onLoad: async function (options) {
		    
		    const {
				type,id
			}=options
			console.log("options:",options); // 打印查看传递的参数
		   
		      const { result: { data } } = await uniCloud.database().collection(options.type).where({
		        _id: options.id
		      }).get();
		      this.detailData = data[0];
			  console.log(data)
		   
		  }
	}
</script>

<style lang="scss">
	.Box {
		width: 360px;
		margin: auto;
		.swiperBox {
			margin: 5px auto;
			height: 230px;
			border-radius: 10px;
			img {
				width: 360px;
				height: 230px;
				border-radius: 10px;
			}
		}
		.titleBox {
			height: 40px;
			margin: 10px 0px;
			position: relative;
			.begin {
				width: 10px;
				height: 40px;
				display: inline-block;
				background-color: #13742f;
			}
			img {
				margin:0px 5px ;
				width: 37px;
				height: 37px;
			}
			.title {
				position: absolute;
				left: 50px;
				top: 3px;
				margin-left: 10px;
				font-size: 26px;
			}
		}
		.summary {
			font-size: 19px;
			letter-spacing: 0.5px;
		}
		.describBox {
			width: 350px;
			margin-top: 10px;
			padding: 2px 5px;
			border-radius: 10px;
			background-color: rgba(19, 116, 47,0.1);
			border: 2px solid rgba(19, 116, 47,0.7);
		}
	}
</style>
