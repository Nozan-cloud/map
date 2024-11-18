<template>
	<!-- 必玩景区组件 -->
	<view>
		<view class="title">
			必玩景区
		</view>
		<view class="more" @click="toMore">
					更多 >
		</view>
		<!-- 轮播图 -->
		<view class="box">
			<view>
				<swiper class="swiperBox" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
					<swiper-item v-for="item in scenicData" :key="item._id">
						<view class="itemBox" @click="redirectTo(item._id)">
							<scenicSpotItem :data="item"></scenicSpotItem>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import scenicSpotItem from "../../components/scenicSpotItem/scenicSpotItem.vue"
	export default {
		data() {
			return {
				// 调试静态数据
				// scenicData: [
				// 	{
				// 		// 这里的用id来获取不同的数据 将id传入跳转参数之中
				// 		id: 1,
				// 		backgroundImg: '../../static/image/华农景点/华农景点-农博馆.jpg',
				// 		title: '华农农博馆',
				// 		label: ['华农历史','农物收藏']
				// 	},
				// 	{
				// 		id: 2,
				// 		backgroundImg: '../../static/image/华农景点/华农景点-牌坊门.jpg',
				// 		title: '牌坊门',
				// 		label: ['华农历史']
				// 	},
				// 	{
				// 		id: 3,
				// 		backgroundImg: '../../static/image/华农景点/华农景点-红满堂.jpg',
				// 		title: '红满堂',
				// 		label: ['华农历史']
				// 	}
				// ]
				scenicData: []
			};
		},
		components:{
			scenicSpotItem
		},
		methods: {
			redirectTo(id) {
				uni.navigateTo({
					url: `/pages/detailPages/detailPages?id=${id}`
				})
			},
			// 跳转到全部，并传递数据库名称
			toMore() {
			  uni.navigateTo({
			    url: '/pages/allArt/allArt?db=scenicSpot'
			  })
			}
		},
		async mounted() {
			// 从数据库拿数据
			const { result: { data } } = await uniCloud.database().collection('scenicSpot').limit(4).get()
			// console.log(data)
			this.scenicData = data
		}
	}
</script>

<style>
	.title {
		padding-left: 15px;
		border-left: 5px solid #13742f;
		margin-bottom: 20px;
		font-size: 18px;
		display: inline-block;
	}
	.more {
			display: inline-block;
			margin-left: 190px;
			width: 60px;
			height: 30px;
			line-height: 30px;
			text-align: center;
			border-radius: 10px;
			/* background-color: rgba(19, 116, 47,0.3); */
			background-color: #13742f;
			border: 1px solid #e7f1ea;
			color: white;
			box-shadow: 2px 2px 3px #d1cfc9;
		}
	.swiperBox {
		height: 250px;
	}
	.itemBox {
		width: 330px;
		margin: auto;
	}
</style>