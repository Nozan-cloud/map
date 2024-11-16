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
						<view v-for="item in productsData.groupOne" :key="item">
							<swiperSonItem :data="item"></swiperSonItem>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in productsData.groupTwo" :key="item">
							<swiperSonItem :data="item"></swiperSonItem>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view v-for="item in productsData.groupThree" :key="item">
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
							title: 'POLO衫',
							backgroundImg: '../../static/image/文创产品/POLO衫.jpg'
						},
						{
							title: '茶产品',
							backgroundImg: '../../static/image/文创产品/茶产品.jpg'
						},
						{
							title: '集章本',
							backgroundImg: '../../static/image/文创产品/集章本.jpg'
						}
					],
					groupTwo: [
						{
							title: '农产品',
							backgroundImg: '../../static/image/文创产品/农产品.jpg'
						},
						{
							title: '巧克力',
							backgroundImg: '../../static/image/文创产品/巧克力.jpg'
						},
						{
							title: '文创公仔',
							backgroundImg: '../../static/image/文创产品/文创公仔.jpg'
						}
					],
					groupThree: [
						{
							title: '钥匙扣',
							backgroundImg: '../../static/image/文创产品/钥匙扣.jpg'
						},
						{
							title: '雨伞',
							backgroundImg: '../../static/image/文创产品/雨伞.jpg'
						},
						{
							title: '更多',
							backgroundImg: '../../static/image/文创产品/更多.jpg'
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
