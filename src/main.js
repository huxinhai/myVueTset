import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AMap from 'vue-amap'

Vue.config.productionTip = false


Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(AMap)


AMap.initAMapApiLoader({
	key: '5c5e764662f4a2c2ddee895e062fd869',
	plugin: ['AMap.Geolocation']
})

new Vue({
	render: h => h(App),
	router: router
}).$mount('#app')
