<template>
	<view>
		<view class="title">
			特色美食
		</view>
		<view class="more" @click="toMore">
					更多 >
		</view>
		<view v-for="item in foodsData" :key="item._id" @click="redirectTo(item._id)">
			<swiperSonItem :data="item"></swiperSonItem>
		</view>
		<view class="spaceBox"></view>
	</view>
</template>

<script>
import swiperSonItem from '../../components/swiperItemBox/swiperSonItem.vue';
	export default {
		data() {
			return {
				//  静态调试数据
				// foodsData: [
				// 	{
				// 		id: 1,
				// 		title: '华农酸奶',
				// 		backgroundImg: '../../static/image/美食/华农酸奶.jpg'
				// 	},
				// 	{
				// 		id: 2,
				// 		title: '蛋包饭',
				// 		backgroundImg: '../../static/image/美食/蛋包饭.jpg'
				// 	},
				// 	{
				// 		id: 3,
				// 		title: '笼仔饭',
				// 		backgroundImg: '../../static/image/美食/笼仔饭.jpg'
				// 	},
				// 	{
				// 		id: 4,
				// 		title: '小锅菜',
				// 		backgroundImg: '../../static/image/美食/小锅菜.jpg'
				// 	},
				// 	{
				// 		id: 5,
				// 		title: '营养餐',
				// 		backgroundImg: '../../static/image/美食/营养餐.jpg'
				// 	},
				// 	{
				// 		id: 6,
				// 		title: '自选菜',
				// 		backgroundImg: '../../static/image/美食/自选菜.jpg'
				// 	},
				// ] 
				foodsData: []
			};
		},
		components: {
			swiperSonItem
		},
		methods: {
			redirectTo(id) {
				uni.navigateTo({
					url: `/pages/detailPages/detailPages?id=${id}`
				})
			},
			// 跳转到全部
			toMore() {
			  uni.navigateTo({
			    url: '/pages/allArt/index?db=foods'
			  })
			}
		},
		async mounted() {
			const { result: { data } } = await uniCloud.database().collection('foods').limit(6).get()
			this.foodsData = data
			console.log(this.foodsData)
		}
	}
</script>

<style lang="scss">
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
	// 空白盒 这里是用来防止高度坍塌
	.spaceBox {
		// width: 10px;
		// height: 10px;
		clear: left;
	}
</style>
