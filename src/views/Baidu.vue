<template>
	<baidu-map ak="WOleDLs5FjTVLa4vGzkMTIoBcKZw3bGC" class="bm-view" :center="center" :zoom="zoom" @ready="handler"
		:scroll-wheel-zoom="true">
		<bm-marker v-for="(marker,index) in markers" :key="index" :position="marker" @click="clickHandler(marker)">

		</bm-marker>
		<bm-info-window :position="windows" :show="show" @close="infoWindowClose" @open="infoWindowOpen">
			<div>市区：<span>{{windows.pointDetails.districtName}}</span></div>
			<div>街道：<span>{{windows.pointDetails.streetName}}</span></div>
			<div>详细地址：<span>{{windows.pointDetails.jcssName}}</span></div>
		</bm-info-window>
		<bm-polyline v-for="(polylinePaths,index) in polylinePath" :key="(index+'line')" :path="polylinePaths"
			stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
		<bm-polygon v-for="(polygonPaths,index) in polygonPath" :key="(index+'gon')" :path="polygonPaths"
			stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="2" />
	</baidu-map>
</template>


<script>
	import axios from 'axios'
	import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
	import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
	import BmInfoWindow from 'vue-baidu-map/components/overlays/InfoWindow.vue'
	import BmPolyline from 'vue-baidu-map/components/overlays/Polyline.vue'
	import BmPolygon from 'vue-baidu-map/components/overlays/Polygon.vue'
	export default {
		components: {
			BaiduMap,
			BmMarker,
			BmInfoWindow,
			BmPolyline,
			BmPolygon
		},
		data() {
			return {
				center: {
					lng: 120.63825161565202,
					lat: 31.328663670874008
				},
				zoom: 15,
				markers: [],
				show: false,
				windows: {
					lng: 0,
					lat: 0,
					pointDetails: {
						districtName: '',
						streetName: '',
						jcssName: ''
					}
				},
				polylinePath: [],
				polygonPath: []
			}
		},
		methods: {
			handler({
				BMap,
				map
			}) {
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
					// let point = new BMap.Point(this.polylinePath[0][0].lng, this.polylinePath[0][0].lat)
					// map.setCenter(point)
				})
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
					// let point = new BMap.Point(this.polygonPath[0][0].lng, this.polygonPath[0][0].lat)
					// map.setCenter(point)
				})
			},
			clickHandler(marker) {
				this.show = true
				this.windows.lng = marker.lng
				this.windows.lat = marker.lat
				axios.get('api/pointDetails', {
					params: {
						id: marker.id
					}
				}).then(data => {
					this.windows.pointDetails.districtName = data.data[0].districtName
					this.windows.pointDetails.streetName = data.data[0].streetName
					this.windows.pointDetails.jcssName = data.data[0].jcssName
				})
			},
			infoWindowClose() {
				this.show = false
				Object.keys(this.windows.pointDetails).forEach(key => this.windows.pointDetails[key] = '')
			},
			infoWindowOpen() {
				this.show = true
			}
		},
		created() {
			axios.get('api/mapPoint').then(data => {
				this.markers = data.data
				console.log(this.markers)
			})
		}
	}
</script>

<style scoped>
	.bm-view {
		width: 100%;
		height: 100%;
	}

	.content {
		overflow-y: unset !important;
	}
</style>
