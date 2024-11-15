<template>
	<!-- 必玩景区组件 -->
	<view>
		<view class="title">
			必玩景区
		</view>
		<!-- 轮播图 缺动态渲染与逻辑 -->
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
			}
		},
		async mounted() {
			// 从数据库拿数据
			const { result: { data } } = await uniCloud.database().collection('scenicSpot').get()
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
	}
	.swiperBox {
		height: 250px;
	}
	.itemBox {
		width: 330px;
		margin: auto;
	}
</style>