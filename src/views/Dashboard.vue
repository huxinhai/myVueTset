<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="8">
				<el-card shadow="hover" class="mgb20" style="height:252px;">
					<div class="user-info">
						<img src="../assets/img/img.jpg" class="user-avator" alt />
						<div class="user-info-cont">
							<div>admin</div>
						</div>
					</div>
					<div class="user-info-list">
						上次登录时间：
						<span>2019-11-01</span>
					</div>
					<div class="user-info-list">
						上次登录地点：
						<span>东莞</span>
					</div>
				</el-card>
				<el-card shadow="hover" style="height:252px; ">
					<template #header>
						<div class="clearfix">
							<span>语言详情</span>
						</div>
					</template>
					<div style="overflow:auto; height: 154px;">
						<div v-for="item in Language" :key="item.id">
							<span>{{item.language}}</span>
							<el-progress :percentage="item.Proficiency" color="#42b983"></el-progress>
						</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<i class="el-icon-user-solid grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">{{messageUname}}</div>
									<div>用户访问量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<i class="el-icon-message-solid grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">{{messageSystem}}</div>
									<div>系统消息</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<i class="el-icon-s-goods grid-con-icon"></i>
								<div class="grid-cont-right">
									<div class="grid-num">{{messageNum}}</div>
									<div>数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>待办事项</span>
							<el-button style="float: right; padding: 3px 0" type="text" @click="open">添加</el-button>
						</div>
					</template>

					<el-table :show-header="false" :data="todoList" tooltip-effect="dark" style="width:100%"
						height="305">
						<el-table-column width="40">
							<template #default="scope">
								<el-checkbox v-model="scope.row.status" @change="handleCheckedCitiesChange(scope.row)">
								</el-checkbox>
							</template>
						</el-table-column>
						<el-table-column>
							<template #default="scope">
								<div class="todo-item" :class="{'todo-item-del': scope.row.status,}">
									{{ scope.row.title }}
								</div>
							</template>
						</el-table-column>
						<el-table-column width="100">
							<template #default="scope">
								<i class="el-icon-edit" @click="open1(scope.row.title,scope.row.id)"
									style="padding-right: 10px;"></i>
								<i class="el-icon-delete" @click="deleteTodoList(scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</el-col>
		</el-row>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import Schart from "vue-schart";
	import axios from 'axios'
	import options from '../assets/js/chatOptions.js'
	export default {
		name: 'Dashboard',
		components: {
			Schart
		},
		created() {
			axios.get('api/detailsLanguage').then(data => {
				this.Language = data.data
			})
			axios.get('api/dashboardXx').then(data => {
				this.messageUname = data.data[0].uname_access
				this.messageSystem = data.data[0].System_message
				this.messageNum = data.data[0].num
			})
			axios.get('api/weeklySales').then(data => {
				let optionsBar = options.chat('bar', '最近一周各品类销售图', data.data[0].labels, data.data[1].datasets)
				this.options = optionsBar
			})
			axios.get('api/monthlySales').then(data => {
				let optionsLine = options.chat('line', '最近几个月各品类销售趋势图', data.data[0].labels, data.data[1].datasets)
				this.options2 = optionsLine
			})
			axios.get('api/dashboardTodo').then(data => {
				let todoList = data.data.map(value => {
					value.status == 1 ? value.status = true : value.status = false
					return value
				})
				this.todoList = todoList
			})
		},
		data() {
			return {
				Language: [],
				todoList: [],
				messageUname: '',
				messageSystem: '',
				messageNum: '',
				options: {},
				options2: {},
			}
		},
		methods: {
			open() {
				this.$prompt('请输入待办事项', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					this.$message({
						type: 'success',
						message: '你的待办事项是: ' + value
					});
					axios.get('api/dashboardTodoAdd', {
						params: {
							title: value
						}
					}).then(data => {
						if (data instanceof Object) {
							axios.get('api/dashboardTodo').then(data => {
								let todoList = data.data.map(value => {
									value.status == 1 ? value.status = true : value
										.status = false
									return value
								})
								this.todoList = todoList
							})
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			open1(v, i) {
				this.$prompt('请输入待办事项', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: v
				}).then(({
					value
				}) => {

					this.$message({
						type: 'success',
						message: '你的待办事项是: ' + value
					});
					axios.get('api/dashboardTodoUpdate', {
						params: {
							title: value,
							id: i
						}
					}).then(data => {
						if (data instanceof Object) {
							axios.get('api/dashboardTodo').then(data => {
								let todoList = data.data.map(value => {
									value.status == 1 ? value.status = true : value
										.status = false
									return value
								})
								this.todoList = todoList
							})
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			handleCheckedCitiesChange(val) {
				let params = {
					id: val.id,
					status: val.status ? 1 : 0
				}
				axios.get('api/dashboardTodoStatus', {
					params
				}).then(data => {
					if (data instanceof Object) {
						axios.get('api/dashboardTodo').then(data => {
							let todoList = data.data.map(value => {
								value.status == 1 ? value.status = true : value.status = false
								return value
							})
							this.todoList = todoList
						})
					}
				})
			},
			deleteTodoList(id) {
				axios.get('api/dashboardTodoDelete', {
					params: {
						id
					}
				}).then(data => {
					if (data instanceof Object) {
						axios.get('api/dashboardTodo').then(data => {
							let todoList = data.data.map(value => {
								value.status == 1 ? value.status = true : value.status = false
								return value
							})
							this.todoList = todoList
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	.el-row {
		margin-bottom: 20px;
	}

	.grid-content {
		display: flex;
		align-items: center;
		height: 100px;
	}

	.grid-cont-right {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #999;
	}

	.grid-num {
		font-size: 30px;
		font-weight: bold;
	}

	.grid-con-icon {
		font-size: 50px;
		width: 100px;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: #fff;
	}

	.grid-con-1 .grid-con-icon {
		background: rgb(45, 140, 240);
	}

	.grid-con-1 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-2 .grid-con-icon {
		background: rgb(100, 213, 114);
	}

	.grid-con-2 .grid-num {
		color: rgb(45, 140, 240);
	}

	.grid-con-3 .grid-con-icon {
		background: rgb(242, 94, 67);
	}

	.grid-con-3 .grid-num {
		color: rgb(242, 94, 67);
	}

	.user-info {
		display: flex;
		align-items: center;
		padding-bottom: 20px;
		border-bottom: 2px solid #ccc;
		margin-bottom: 20px;
	}

	.user-avator {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}

	.user-info-cont {
		padding-left: 50px;
		flex: 1;
		font-size: 14px;
		color: #999;
	}

	.user-info-cont div:first-child {
		font-size: 30px;
		color: #222;
	}

	.user-info-list {
		font-size: 14px;
		color: #999;
		line-height: 25px;
	}

	.user-info-list span {
		margin-left: 70px;
	}

	.mgb20 {
		margin-bottom: 20px;
	}

	.todo-item {
		font-size: 14px;
	}

	.todo-item-del {
		text-decoration: line-through;
		color: #999;
	}

	.schart {
		width: 100%;
		height: 300px;
	}
</style>
