<template>
	<view>
		<view class="title">
			文创产品
		</view>
		<!-- 轮播图 -->
		<view class="swiperBox">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in productsData.groupOne" :key="item.id">
							<swiperSonItem :data="item"></swiperSonItem>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in productsData.groupTwo" :key="item.id">
							<swiperSonItem :data="item"></swiperSonItem>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in productsData.groupThree" :key="item.id">
							<swiperSonItem :data="item"></swiperSonItem>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import swiperSonItem from '../../components/swiperItemBox/swiperSonItem.vue'
	export default {
		data() {
			return {
				productsData: {
					groupOne: [
						{
							id: 1,
							title: 'POLO衫',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/POLO衫.jpg`
								}
							]
						},
						{
							id: 2,
							title: '茶产品',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/茶产品.jpg`
								}
							]
						},
						{
							id: 3,
							title: '集章本',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/集章本.jpg`
								}
							]
						}
					],
					groupTwo: [
						{
							id: 1,
							title: '农产品',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/农产品.jpg`
								}
							]
						},
						{
							id: 2,
							title: '巧克力',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/巧克力.jpg`
								}
							]
						},
						{
							id: 3,
							title: '文创公仔',
							pictures: [
								{
									fileID: `https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/文创公仔.jpg`
								}
							]
						}
					],
					groupThree: [
						{
							id: 1,
							title: '钥匙扣',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/钥匙扣.jpg`
								} 
							]
						},
						{
							id: 2,
							title: '雨伞',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/雨伞.jpg`
								}
							]
						},
						{
							id: 3,
							title: '更多',
							pictures: [
								{
									fileID:`https://mp-b98f95b8-7904-4a54-8bf2-8f0098b62dda.cdn.bspapp.com/Lvto/文创/更多.jpg`
								}
								
							]
						}
					]
				}
			}
		},
		components: {
			swiperSonItem
		},
		methods: {
			
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

</style>
