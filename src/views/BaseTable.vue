<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-cascades"></i> 基础表格
				</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="address" placeholder="地址" class="handle-select mr10">
					<el-option key="0" label="全部" value=""></el-option>
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
					<el-option key="3" label="江西省" value="江西省"></el-option>
					<el-option key="4" label="福建省" value="福建省"></el-option>
					<el-option key="5" label="上海市" value="上海市"></el-option>
				</el-select>
				<el-input v-model="name" placeholder="用户名" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
				<el-button type="primary" style="float: right" @click="handleAdd('新增')">新增</el-button>
			</div>
			<el-table border :data="tableData" type="index" class="table" ref="multipleTable"
				header-cell-class-name="table-header">
				<el-table-column label="序号" width="55" align="center">
					<template #default="scope">{{ scope.$index + 1 }}</template>
				</el-table-column>
				<el-table-column prop="name" label="用户名"></el-table-column>
				<el-table-column label="账户余额">
					<template #default="scope">￥{{ scope.row.money }}</template>
				</el-table-column>
				<el-table-column prop="address" label="地址"></el-table-column>
				<el-table-column label="状态" align="center">
					<template #default="scope">
						<el-tag :type="
                scope.row.state === '成功'
                  ? 'success'
                  : scope.row.state === '失败'
                  ? 'danger'
                  : ''
              ">{{ scope.row.state }}</el-tag>
					</template>
				</el-table-column>

				<el-table-column prop="data" label="注册时间"></el-table-column>
				<el-table-column label="操作" width="180" align="center">
					<template #default="scope">
						<el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row, '编辑')">编辑
						</el-button>
						<el-button type="text" icon="el-icon-delete" style="color: red"
							@click="handleDelete(scope.row.id)">删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
					:page-size="pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>

		<!-- 编辑弹出框 -->
		<!-- <el-dialog :title="title" :visible.sync="editVisible" width="30%">
			<el-form label-width="70px">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="用户名">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账户余额">
							<el-input v-model="form.money"
								oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 3):value"
								type="number" maxlength="11" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="地址">
							<el-select v-model="form.address" placeholder="请选择">
								<el-option key="1" label="广东省" value="广东省"></el-option>
								<el-option key="2" label="湖南省" value="湖南省"></el-option>
								<el-option key="3" label="江西省" value="江西省"></el-option>
								<el-option key="4" label="福建省" value="福建省"></el-option>
								<el-option key="5" label="上海市" value="上海市"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="注册时间">
							<el-date-picker v-model="form.data" style="width: auto;" align="right" type="date"
								placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col>
						<el-form-item label="状态">
							<el-radio v-model="form.state" label="成功" border size="medium">成功</el-radio>
							<el-radio v-model="form.state" label="失败" border size="medium">失败</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog> -->
		<!-- <sydiv-dialog></sydiv-dialog> -->
		<popup :title="title" :visible.sync="editVisible" :width="'30%'" @updateVisible="updateVisible"
			@resetPopupData="editVisible = false" @submitPopupData="saveEdit" @handleClose="editVisible = false">
			<el-form label-width="70px">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="用户名">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="账户余额">
							<el-input v-model="form.money"
								oninput="value=value.indexOf('.') > -1?value.slice(0, value.indexOf('.') + 3):value"
								type="number" maxlength="11" autocomplete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="地址">
							<el-select v-model="form.address" placeholder="请选择">
								<el-option key="1" label="广东省" value="广东省"></el-option>
								<el-option key="2" label="湖南省" value="湖南省"></el-option>
								<el-option key="3" label="江西省" value="江西省"></el-option>
								<el-option key="4" label="福建省" value="福建省"></el-option>
								<el-option key="5" label="上海市" value="上海市"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="注册时间">
							<el-date-picker v-model="form.data" style="width: auto" align="right" type="date"
								placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col>
						<el-form-item label="状态">
							<el-radio v-model="form.state" label="成功" border size="medium">成功</el-radio>
							<el-radio v-model="form.state" label="失败" border size="medium">失败</el-radio>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</popup>
	</div>
</template>

<script>
	import axios from "axios";
	import Popup from "./DialogSy.vue";
	export default {
		components: {
			Popup,
		},
		data() {
			return {
				address: "",
				name: "",
				tableData: [],
				pageIndex: 1,
				pageSize: 10,
				pageTotal: 0,
				editVisible: false,
				title: "",
				form: {
					money: "",
					address: "",
					data: "",
					state: "",
					name: "",
					id: "",
				},
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
							text: "今天",
							onClick(picker) {
								picker.$emit("pick", new Date());
							},
						},
						{
							text: "昨天",
							onClick(picker) {
								const date = new Date();
								date.setTime(date.getTime() - 3600 * 1000 * 24);
								picker.$emit("pick", date);
							},
						},
						{
							text: "一周前",
							onClick(picker) {
								const date = new Date();
								date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
								picker.$emit("pick", date);
							},
						},
					],
				},
			};
		},
		methods: {
			updateVisible(val) {
				this.editVisible = val;
			},
			handleSearch() {
				axios
					.get("api/vTableSelect", {
						params: {
							pageIndex: this.pageIndex,
							pageSize: this.pageSize,
							address: this.address,
							name: this.name,
						},
					})
					.then((data) => {
						this.tableData = data.data.data;
						this.pageTotal = data.data.pageTotal;
					});
			},
			handleDelete(id) {
				this.$confirm("确定要删除吗？", "提示", {
					type: "warning",
					confirmButtonText: "确定",
					cancelButtonText: "取消",
				}).then(() => {
					axios
						.get("api/vTableDelete", {
							params: {
								id,
							},
						})
						.then((data) => {
							if (data.data.code == 200) {
								this.getData(this.pageIndex, this.pageSize);
								this.$message({
									type: "success",
									message: "删除成功",
								});
							}
						});
				});
			},
			handlePageChange(val) {
				this.pageIndex = val;
				this.getData(this.pageIndex, this.pageSize);
			},
			handleAdd(title) {
				this.editVisible = true;
				this.title = title;
				Object.keys(this.form).forEach((key) => (this.form[key] = ""));
				this.form.state = "成功";
			},
			handleEdit(row, title) {
				this.editVisible = true;
				console.log(this.form);
				Object.keys(this.form).forEach((item) => {
					this.form[item] = row[item];
				});
				this.title = title;
			},
			//重新查询方法
			getData(pageIndex, pageSize) {
				axios
					.get("api/vTable", {
						params: {
							pageIndex,
							pageSize,
						},
					})
					.then((data) => {
						this.tableData = data.data.data;
						this.pageTotal = data.data.pageTotal;
					});
			},
			saveEdit() {
				let params = this.form;
				if (this.title == "编辑") {
					axios
						.get("api/vTableUpdate", {
							params,
						})
						.then((data) => {
							if (data.data == "修改成功") {
								this.getData(this.pageIndex, this.pageSize);
								this.$message({
									type: "success",
									message: "修改成功",
								});
								this.editVisible = false;
							}
						});
				} else if (this.title == "新增") {
					let params = this.form;
					axios
						.get("api/vTableInsert", {
							params,
						})
						.then((data) => {
							if (data.data == "新增成功") {
								this.getData(this.pageIndex, this.pageSize);
								this.$message({
									type: "success",
									message: "新增成功",
								});
								this.editVisible = false;
							} else {
								this.$message({
									type: "info",
									message: "新增失败",
								});
							}
						});
				}
			},
		},
		created() {
			this.getData(this.pageIndex, this.pageSize);
		},
	};
</script>

<style>
	.handle-box {
		margin-bottom: 20px;
	}

	.handle-select {
		width: 120px;
	}

	.handle-input {
		width: 300px;
		display: inline-block;
	}

	.table {
		width: 100%;
		font-size: 14px;
	}

	.red {
		color: #ff0000;
	}

	.mr10 {
		margin-right: 10px;
	}

	.table-td-thumb {
		display: block;
		margin: auto;
		width: 40px;
		height: 40px;
	}

	.red:hover {
		color: #ff0000;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}

	input[type="number"] {
		-moz-appearance: textfield;
	}
</style>
