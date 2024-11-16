<template>
	<view>
		<!-- 导航栏 -->
		<view class="banner" style="margin-top: 10px;">
			<homeBanner></homeBanner>
		</view>
		<!-- 必玩景区 -->
		<view class="scenicSpot">
			<scenicSpot></scenicSpot>
		</view>
		<!-- 特色美食 -->
		<view class="foods">
			<foods></foods>
		</view>
		<!-- 文创产品 -->
		<view class="products">
			<products></products>
		</view>
	</view>
</template>

<script>
import scenicSpot from '../scenicSpot/index.vue' 
import foods from '../foods/index.vue'
import products from '../Product/Product.vue'
import homeBanner from '../homeBanner/homeBanner.vue'
	export default {
		data() {
			return {
				
			};
		},
		components:{
			scenicSpot, // 必玩景区
			foods, // 特色美食
			products, //文创产品
			homeBanner //导航栏
		}
	}
</script>

<style lang="scss">
	.scenicSpot, .foods, .products, .banner{
		width: 350px;
		margin: 30px auto;
	}
</style>
