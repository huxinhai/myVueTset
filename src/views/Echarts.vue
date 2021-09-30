<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<div class="content-title">柱状图</div>
				<div ref="bar" class="highcharts-container"></div>
			</el-col>
			<el-col :span="12">
				<div class="content-title">折线图</div>
				<div ref="line" class="highcharts-container"></div>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<div class="content-title">饼状图</div>
				<div ref="pie" class="highcharts-container"></div>
			</el-col>
			<el-col :span="12">
				<div class="content-title">环形图</div>
				<div ref="ring" class="highcharts-container"></div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import axios from "axios";
	import chart from "../assets/js/chatOptions";
	export default {
		name: "Echarts",
		data() {
			return {

			};
		},
		methods: {
			//  myEcharts() {
			//    let bar = this.Bar;
			// console.log(JSON.stringify(this.Bar))
			//    console.log(bar);
			//    chart.echartsBar(this.$refs.bar, bar.data, bar.series);
			//  },
		},
		mounted() {
			axios.get("api/weeklySales").then((res) => {
				let type = "bar"; //图表类型
				let obj = res.data[1].datasets;
				let series = obj.map((v) => {
					//修改对象属性的名称
					return {
						name: v.label,
						data: v.data,
						type
					};
				});
				chart.echartsBar(this.$refs.bar, res.data[0].labels, series);
			});
			axios.get("api/monthlySales").then((res) => {
				let type = "line"; //图表类型
				let obj = res.data[1].datasets;
				let series = obj.map((v) => {
					//修改对象属性的名称
					return {
						name: v.label,
						data: v.data,
						type
					};
				});
				chart.echartsBar(this.$refs.line, res.data[0].labels, series);
			});
			axios.get("api/chatsPie").then((res) => {
				let data = []
				res.data.labels.forEach((ress, index) => {
					let obj = {
						value: res.data.data[index],
						name: ress
					}
					data.push(obj)
				})
				chart.echartsPie(this.$refs.pie, '50%', data)
			});
			axios.get("api/chatsRing").then((res) => {
				let data = []
				res.data.labels.forEach((ress, index) => {
					let obj = {
						value: res.data.data[index],
						name: ress
					}
					data.push(obj)
				})
				console.log(data)
				chart.echartsPie(this.$refs.ring, ['40%', '70%'], data)
			});
		},
		created() {

		},
	};
</script>

<style scoped>
	.content-title {
		clear: both;
		font-weight: 400;
		line-height: 50px;
		margin: 10px 0;
		font-size: 22px;
		color: #1f2f3d;
	}

	.highcharts-container {
		/* width: 600px; */
		height: 400px;
		border: 1px solid #ddd;
		margin: auto;
	}
</style>
