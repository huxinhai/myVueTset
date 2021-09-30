import * as echarts from "echarts";
export default {
	chat: function(type, text, labels, datasets) {
		const options = {
			type,
			title: {
				text,
			},
			xRorate: 25,
			labels,
			datasets
		}
		return options
	},
	column: function(type, categories, series) {
		const options = {
			chart: {
				type
			},
			title: {
				text: "最近一周各品类销售图",
			},
			subtitle: {
				text: "数据来源：nodejs",
			},
			yAxis: {
				title: {
					text: "",
				},
			},
			legend: {
				layout: "vertical",
				align: "right",
				verticalAlign: "middle",
			},
			plotOptions: {
				series: {
					label: {
						connectorAllowed: false,
					},
					//pointStart: 2010,
				},
			},
			xAxis: {
				categories
			},
			series,
			responsive: {
				rules: [{
					condition: {
						maxWidth: 500,
					},
					chartOptions: {
						legend: {
							layout: "horizontal",
							align: "center",
							verticalAlign: "bottom",
						},
					},
				}, ],
			},
		}
		return options
	},
	pie: function(type, data) {
		let options = {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type
			},
			title: {
				text: '2018年1月浏览器市场份额'
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					}
				}
			},
			series: [{
				name: 'Brands',
				colorByPoint: true,
				data
			}]
		}
		return options
	},
	doughnut: function(data) {
		let options = {
			chart: {
				spacing: [40, 0, 40, 0]
			},
			title: {
				floating: true,
				text: ''
			},
			tooltip: {
				pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.percentage:.1f} %',
					}
				}
			},
			series: [{
				type: 'pie',
				innerSize: '80%',
				name: '市场份额',
				data
			}]
		}
		return options
	},
	echartsBar: function(elem, data, series) {
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init(elem);

		// 指定图表的配置项和数据
		var option = {
			title: {
				text: '',
				left: 'center'
			},
			legend: {},
			tooltip: {},

			xAxis: {
				type: 'category',
				data
			},
			yAxis: {},
			series
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	echartsPie: function(elem, radius, data) {
		var myChart = echarts.init(elem);
		var option = {
			title: {
				text: 'Referer of a Website',
				subtext: 'Fake Data',
				left: 'center'
			},
			tooltip: {
				trigger: 'item'
			},
			legend: {
				orient: 'vertical',
				left: 'left'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius,
				data,
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		}
		myChart.setOption(option);
	}
}
