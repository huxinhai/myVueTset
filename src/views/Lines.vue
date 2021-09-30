<template>
	<baidu-map ak="WOleDLs5FjTVLa4vGzkMTIoBcKZw3bGC" class="map" :center="{lng: 120.590504, lat: 31.305415}" :zoom="15" @ready="handler"
		:scroll-wheel-zoom="true">
		<bm-polyline v-for="(polylinePaths,index) in polylinePath" :key="index" :path="polylinePaths" stroke-color="blue"
			:stroke-opacity="0.5" :stroke-weight="2" @click="polylinePaths1"></bm-polyline>
	</baidu-map>
</template>

<script>
	import axios from 'axios'
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import BmPolyline from 'vue-baidu-map/components/overlays/Polyline.vue'
	export default {
		components:{
			BaiduMap,
			BmPolyline
		},
		data() {
			return {
				polylinePath: []
			}
		},
		methods: {
			handler({
				BMap,
				map,
			}) {
				console.log(map)
				axios.get('api/mapLines').then(data => {

					data.data.forEach(res => {
						// console.log(res)
						let shape = []
						let obj = {}
						res.shape.forEach(shapes => {
							obj = {
								...shapes
							}
							let {
								0: lng,
								1: lat
							} = obj
							let obj1 = {
								lng,
								lat
							}
							shape.push(obj1)
						})
						this.polylinePath.push(shape)
					})
					let point = new BMap.Point(this.polylinePath[0][0].lng, this.polylinePath[0][0].lat)
					map.setCenter(point)
				})
			},
			polylinePaths1(e) {
				console.log(e)
			}
		}
	}
</script>

<style scoped>
	.map {
		width: 100%;
		height: 100%;
	}
</style>
