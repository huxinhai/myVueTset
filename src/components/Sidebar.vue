<template>
	<div class="sidebar">
		<el-menu class="sidebar-el-menu" :default-active="activeMenu" :collapse="isCollapse" background-color="#324157"
			text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
			<template v-for="item in items">
				<template v-if="item.subs">
					<el-submenu :index="item.index" :key="item.index">
						<template #title>
							<i :class="item.icon"></i>
							<span>{{ item.title }}</span>
						</template>
						<template v-for="subItem in item.subs">
							<el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
								<template #title>{{ subItem.title }}</template>
								<el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
									{{ threeItem.title }}
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}
							</el-menu-item>
						</template>
					</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="item.index" :key="item.index">
						<i :class="item.icon"></i>
						<template #title>{{ item.title }}</template>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
	</div>
</template>

<script>
	import Store from '../store/index.js'
	export default {
		data() {
			return {
				items: [{
						icon: "el-icon-lx-home",
						index: "/dashboard",
						title: "系统首页",
					},
					{
						icon: "el-icon-lx-cascades",
						index: "/table",
						title: "基础表格",
					},
					{
						icon: "el-icon-lx-copy",
						index:"2",
						title:'地图',
						subs:[{
							icon: "el-icon-lx-copy",
							index:'/baidu',
							title: "百度地图",
						},{
							icon: "el-icon-lx-copy",
							index:'/gaode',
							title:'高德地图'
						},{
							icon: "el-icon-lx-copy",
							index:'/gis',
							title:'gis'
						}]
					},
					{
						icon: "el-icon-lx-copy",
						index: "/tabs",
						title: "tab选项卡",
					},
					{
						icon: "el-icon-lx-calendar",
						index: "3",
						title: "表单相关",
						subs: [{
								index: "/form",
								title: "基本表单",
							},
							{
								index: "/upload",
								title: "文件上传",
							},
							{
								index: "4",
								title: "三级菜单",
								subs: [{
									index: "/editor",
									title: "富文本编辑器",
								}, ],
							},
						],
					},
					{
						icon: "el-icon-lx-emoji",
						index: "/icon",
						title: "自定义图标",
					},
					{
						icon: "el-icon-pie-chart",
						index: "5",
						title: "图表",
						subs:[{
							index:'/highcharts',
							title:'highcharts图表'
						},{
							index:'/echarts',
							title:'echarts图表'
						}]
					},
					{
						icon: "el-icon-lx-global",
						index: "/i18n",
						title: "国际化功能",
					},
					{
						icon: "el-icon-lx-warn",
						index: "7",
						title: "错误处理",
						subs: [{
								index: "/permission",
								title: "权限测试",
							},
							{
								index: "/404",
								title: "404页面",
							},
						],
					},
					{
						icon: "el-icon-lx-redpacket_fill",
						index: "/donate",
						title: "支持作者",
					},
				],
				activeMenu:'/dashboard'
			};
		},
		methods: {
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			}
		},
		computed: {
			isCollapse() {
				const isCollapse = Store.state.isCollapse
				return isCollapse
			}
		},
		watch: {
			$route: {
				immediate: true, // 一旦监听到路由的变化立即执行
				handler(to,from) { // 回调函数，两个参数，to：当前的组件，from：上一个组件
					this.activeMenu = to.path
				}
			}
		}
	}
</script>

<style scoped>
	.sidebar {
		display: block;
		position: absolute;
		left: 0;
		top: 70px;
		bottom: 0;
		overflow-y: scroll;
	}

	.sidebar::-webkit-scrollbar {
		width: 0;
	}

	.sidebar-el-menu:not(.el-menu--collapse) {
		width: 250px;
	}

	.sidebar>ul {
		height: 100%;
	}
</style>
