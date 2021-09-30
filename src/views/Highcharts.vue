<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<div class="content-title">柱状图</div>
				<highcharts class="highcharts-container" :options="barGraph"></highcharts>
			</el-col>
			<el-col :span="12">
				<div class="content-title">折线图</div>
				<highcharts class="highcharts-container" :options="lineChart"></highcharts>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<div class="content-title">饼状图</div>
				<highcharts class="highcharts-container" :options="pieChart"></highcharts>
			</el-col>
			<el-col :span="12">
				<div class="content-title">环形图</div>
				<highcharts class="highcharts-container" :options="doughnut"></highcharts>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import {
		Chart
	} from "highcharts-vue";
	import MyChart from "../assets/js/chatOptions.js"; //封装的参数
	import axios from "axios";
	export default {
		name: "HelloWorld",
		components: {
			highcharts: Chart,
		},
		data() {
			return {
				barGraph: {},
				lineChart: {},
				pieChart: {},
				doughnut: {},
			};
		},
		created() {
			axios.get("api/weeklySales").then((res) => {
				let obj = res.data[1].datasets;
				let series = obj.map((v) => {
					//修改对象属性的名称
					return {
						name: v.label,
						data: v.data
					};
				});
				let barGraph = MyChart.column("column", res.data[0].labels, series); //参数分别为：类型，x轴坐标，表参数
				this.barGraph = barGraph;
			});
			axios.get("api/monthlySales").then((res) => {
				let obj = res.data[1].datasets;
				let series = obj.map((v) => {
					return {
						name: v.label,
						data: v.data
					};
				});
				let lineChart = MyChart.column("", res.data[0].labels, series);
				this.lineChart = lineChart;
			});
			axios.get("api/chatsPie").then((res) => {
				console.log(res.data);
				let arr = [];
				res.data.labels.forEach((resd, index) => {
					let obj = {
						name: resd,
						y: res.data.data[index],
					};
					arr.push(obj);
				});
				let pieChart = MyChart.pie("pie", arr);
				this.pieChart = pieChart;
			});
			axios.get("api/chatsRing").then((res) => {
				let arr = [];
				res.data.labels.forEach((resd, index) => {
					let obj = {
						name: resd,
						y: res.data.data[index],
					};
					arr.push(obj);
				});
				let doughnut = MyChart.doughnut(arr);
				this.doughnut = doughnut;
			});
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
		/* width: 600px;
  height: 400px; */
		border: 1px solid #ddd;
		margin: auto;
	}
</style>
