import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		isCollapse: false
	},
	mutations: {
		handleCollapse(state, data) {
			state.isCollapse = data
		}
	}
})

export default store
