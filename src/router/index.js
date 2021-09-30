import Router from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'

const router = new Router({
	mode: 'history', //去除路径的#号
	routes: [{
			path: '/',
			redirect: '/dashboard'
		},
		{
			path: '/',
			name: "HelloWorld",
			component: HelloWorld,
			children: [{
				path: "/dashboard",
				name: "dashboard",
				meta: {
					title: '系统首页'
				},
				component: () => import( /* webpackChunkName: "dashboard" */
					"../views/Dashboard.vue")
			}, {
				path: "/tabs",
				name: "tabs",
				meta: {
					title: 'Tab栏'
				},
				component: () => import( /* webpackChunkName: "dashboard" */
					"../views/Tabs.vue")
			}, {
				path: '/table',
				name: 'table',
				meta: {
					title: '表格'
				},
				component: () => import( /* webpackChunkName: "dashboard" */
					"../views/BaseTable.vue")
			}, {
				path: "/icon",
				name: "icon",
				meta: {
					title: 'Icon栏'
				},
				component: () => import( /* webpackChunkName: "dashboard" */
					"../views/Icon.vue")
			}, {
				path: '/baidu',
				name: 'baidu',
				meta: {
					title: '百度地图'
				},
				component: () => import('../views/Baidu.vue')
			}, {
				path: '/poly',
				name: 'poly',
				meta: {
					title: '画面'
				},
				component: () => import('../views/Poly.vue')
			}, {
				path: '/lines',
				name: 'lines',
				meta: {
					title: '画线'
				},
				component: () => import('../views/Lines.vue')
			},{
				path: '/gaode',
				name: 'gaode',
				meta: {
					title: '高德地图'
				},
				component: () => import('../views/Gaode.vue')
			},{
				path: '/highcharts',
				name: 'highcharts',
				meta: {
					title: 'highcharts图表'
				},
				component: () => import('../views/Highcharts.vue')
			},{
				path: '/echarts',
				name: 'echarts',
				meta: {
					title: 'echarts'
				},
				component: () => import('../views/Echarts.vue')
			}]
		}, {
			path: "/login",
			name: "Login",
			meta: {
				title: '登录'
			},
			component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
		}
	]
})
router.beforeEach((to, from, next)=>{
	const role = localStorage.getItem('usertest');
	if(!role&&to.path != '/login'){
		next('/login')
	}else{
		next()
	}
})
export default router