<template>
	<el-table :data="tableData" style="width: 100%">
		<el-table-column prop="id" label="日期" width="180">
		</el-table-column>
		<el-table-column prop="name" label="姓名" width="180">
		</el-table-column>
		<el-table-column prop="age" label="地址">
		</el-table-column>
	</el-table>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'Am',
		data() {
			return {
				tableData:''
			}
		},
		mounted(){
			axios('api/dashboardTodoAdd',{title:'代码111',status:'代码那你'}).then(res=>{
				console.log(res.data)
				const data = res.data
				let tableData = [data]
				console.log(tableData[0])
				this.tableData = tableData[0]
				console.log(this.tableData)
			})
			
		}
	}
</script>

<style>
</style>
