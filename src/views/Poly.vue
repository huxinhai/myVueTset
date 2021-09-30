<template>
	<baidu-map ak="WOleDLs5FjTVLa4vGzkMTIoBcKZw3bGC" class="map" :center="{lng: 120.590504, lat: 31.305415}" :zoom="15"
		@ready="handler" :scroll-wheel-zoom="true">
		<bm-polygon v-for="(polygonPaths,index) in polygonPath" :key="index" :path="polygonPaths" stroke-color="blue"
			:stroke-opacity="0.5" :stroke-weight="2" @click="polygonPaths" />
	</baidu-map>
</template>

<script>
	import axios from 'axios'
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import BmPolygon from 'vue-baidu-map/components/overlays/Polygon.vue'
	export default {
		components: {
			BaiduMap,
			BmPolygon
		},
		data() {
			return {
				polygonPath: []
			}
		},
		methods: {
			handler({
				BMap,
				map
			}) {
				axios.get('api/mapPoly').then(data => {
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
						this.polygonPath.push(shape)
					})
					let point = new BMap.Point(this.polygonPath[0][0].lng, this.polygonPath[0][0].lat)
					map.setCenter(point)
				})
			},
			polygonPaths(e) {
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
	.content{
		overflow: scroll;
	}
</style>
