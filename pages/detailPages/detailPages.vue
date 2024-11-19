<template>
	<view class="Box">
		<!-- 图片轮播 -->
		<swiper class="swiperBox" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item v-for="item in detailData.pictures" :key="item">
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
				// 调试数据
				// detailData: 
				// 	{
				// 		img:[
				// 			'../../static/image/华农景点/华农景点-红满堂.jpg',
				// 			'../../static/image/华农景点/华农景点-农博馆.jpg',
				// 			'../../static/image/华农景点/华农景点-牌坊门.jpg'
				// 		],
				// 		title: "红满堂",
				// 		summary: "红满堂是华南农业大学的历史文化符号、标志性建筑。 全国首个砖拱建筑，被称为“广东壳”的红满堂，建于1958年大跃进时期。在当时技术革新浪潮下，华南理工大学李淑敏、蔡益铣大胆采用砖拱结构，试验性地建造了红满堂。它700多平方的大厅没用一根柱子，是全国第一个砖拱驳壳建筑。1999年，“红满堂”被有关部门列为危楼，且无法维修，不得不拆除。在百年校庆之际，华农决定重建“红满堂”,校方的出发点正是要“复苏校友记忆”。复建后的红满堂将设计为多功能活动场所,主要作为学校高端学术会议的专用场所。此后，暨南大学、广州体育学院、星海音乐学院都先后建造起了这种建筑。"
				// 	}
				foodId:'',
				detailData:{}
			};
		},
		// 获取从上一个页面跳转过来的路由参数
		  onLoad: async function (options) {
		    // console.log(type,id); // 打印查看传递的参数
		    const {
				type,id
			}=options
			
		   
		      const { result: { data } } = await uniCloud.database().collection(options.t).where({
		        _id: id
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
