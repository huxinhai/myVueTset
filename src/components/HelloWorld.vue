<template>
	<div>
		<Header></Header>
		<Sidebar></Sidebar>
		<div class="content-box">
			<div class="content" style="overflow-y: auto;">
				<router-view v-slot="{ Component }">
					<transition name="move" mode="out-in">
						<keep-alive :include="tagsList">
							<component :is="Component" />
						</keep-alive>
					</transition>
				</router-view>
				<!-- <el-backtop target=".content"></el-backtop> -->
			</div>
		</div>
	</div>

</template>

<script>
	import Header from './Header.vue'
	import Sidebar from './Sidebar.vue'
	export default {
		name: 'HelloWorld',
		components: {
			Header,
			Sidebar
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
