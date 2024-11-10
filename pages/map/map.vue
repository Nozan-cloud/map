<template>
	
	
		<map style="width: 100%; height: 750vh;" :latitude="latitude" :longitude="longitude" :markers="covers">
		</map>

</template>

<script>
	export default {
		data() {
			return {
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 23.1,
				longitude: 113.26,
				covers: [{
					latitude: 23.1,
					longitude: 113.26,
					// iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					// iconPath: '../../../static/location.png'
				}]
			}
		}
	}
</script>

<style lang="scss">



</style>
