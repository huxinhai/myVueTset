<template>
	<div class="amap-wrapper">
		<el-amap vid="amapDemo" :zoom="zoom" :center="center">
			<el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :key="(index+'mak')"
				:visible="dadian" :events="events" :extData="marker"></el-amap-marker>
			<el-amap-polygon v-for="(polygonPaths,index) in polygonPath" :key="(index+'polygon')" strokeColor="blue"
				fillOpacity="0.5" strokeWeight="2" :path="polygonPaths.position" :visible="huamian"></el-amap-polygon>
			<el-amap-polyline v-for="(polylinePaths,index) in polylinePath" :key="(index+'polyline')" strokeColor="blue"
				fillOpacity="0.5" strokeWeight="2" :path="polylinePaths.path" :visible="huaxian"></el-amap-polyline>
			<el-amap-info-window :position="windows.position" :content="windows.content" :visible="windows.visible" @close="infoWindowClose" @open="infoWindowOpen">
			</el-amap-info-window>
		</el-amap>
		<div style="position:absolute;z-index:9999;top:0px;left:0px;">
			<el-button type="primary" @click="ondadian">打点</el-button>
			<el-button type="primary" @click="onhuamian">画面</el-button>
			<el-button type="primary" @click="onhuaxian">画线</el-button>
			<el-button type="primary" @click="onquanbu">全部</el-button>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		data() {
			let that = this
			return {
				zoom: 13,
				center: [120.63825161565202, 31.328663670874008],
				markers: [],
				windows: {
					position: [120.63825161565202, 31.328663670874008],
					content: '',
					visible:false
				},
				visible: true,
				polygonPath: [],
				polylinePath: [],
				dadian: true,
				huamian: true,
				huaxian: true,
				events: {
					click(e) {
						let windowsi = e.target.getExtData()
						axios.get('api/pointDetails', {
							params: {
								id: windowsi.id
							}
						}).then(data => {
							that.windows.position = windowsi.position
							that.windows.content = `
								<div>市区：<span>${data.data[0].districtName}</span></div>
								<div>街道：<span>${data.data[0].streetName}</span></div>
								<div>详细地址：<span>${data.data[0].jcssName}</span></div>
							`
							that.windows.visible = true
							console.log(that.windows.visible)
						})
					}
				}
			}
		},
		created() {
			axios.get('api/mapPoint').then(data => {
				data.data.forEach(res => {
					let obj = {
						position: [res.lng, res.lat],
						id: res.id
					}
					this.markers.push(obj)
				})
			})
			axios.get('api/mapPoly').then(data => {
				data.data.forEach(res => {
					let obj = {
						position: res.shape,
						id: res.id
					}
					this.polygonPath.push(obj)
				})
			})
			axios.get('api/mapLines').then(data => {
				data.data.forEach(res => {
					let obj = {
						path: res.shape,
						id: res.id
					}
					this.polylinePath.push(obj)
				})
			})
		},
		methods: {
			ondadian() {
				this.dadian = !this.dadian
			},
			onhuamian() {
				this.huamian = !this.huamian
			},
			onhuaxian() {
				this.huaxian = !this.huaxian
			},
			onquanbu() {
				this.dadian = true
				this.huamian = true
				this.huaxian = true
			},
			infoWindowClose() {
				this.windows.visible = false
			},
			infoWindowOpen() {
				this.windows.visible = true
			}
		}
	}
</script>

<style scoped>
	.amap-wrapper {
		height: 100%;
		width: 100%;
	}
</style>
