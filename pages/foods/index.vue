<template>
	<view>
		<view class="title">
			特色美食
		</view>
		<view v-for="item in foodsData" :key="item._id" @click="redirectTo(item._id)">
			<foodItem :data="item"></foodItem>
		</view>
		<view class="spaceBox"></view>
	</view>
</template>

<script>
import foodItem from '../../components/foodItem/foodItem.vue';
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
			foodItem
		},
		methods: {
			redirectTo(id) {
				uni.navigateTo({
					url: `/pages/detailPages/detailPages?id=${id}`
				})
			}
		},
		async mounted() {
			const { result: { data } } = await uniCloud.database().collection('foods').get()
			this.foodsData = data
			// console.log(this.foodsData)
		}
	}
</script>

<style lang="scss">
	.title {
		padding-left: 15px;
		border-left: 5px solid #13742f;
		margin-bottom: 20px;
		font-size: 18px;
	}
	// 空白盒 这里是用来防止高度坍塌
	.spaceBox {
		// width: 10px;
		// height: 10px;
		clear: left;
	}
</style>
