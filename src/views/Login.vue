<template>
	<div class="login-wrap">
		<div class="ms-login">
			<div class="ms-title">后台管理系统</div>
			<el-form :model="param" ref="login" label-width="0px" class="ms-content">
				<el-form-item prop="username">
					<el-input v-model="param.username" placeholder="username">
						<template #prepend>
							<el-button icon="el-icon-user"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="param.password" type="password" placeholder="password">
						<template #prepend>
							<el-button icon="el-icon-lock"></el-button>
						</template>
					</el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="login()">登录</el-button>
				</div>
				<p class="login-tips" @click="register">注册</p>
			</el-form>
		</div>
		<el-dialog title="注册" :visible.sync="editVisible" width="20%" :closeOnClickModal='false'>
			<el-form label-width="70px" :model="form" :rules="rules" ref="form">
				<el-form-item label="用户名" prop="uname">
					<el-input v-model="form.uname"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input type="password" v-model="form.pwd"></el-input>
				</el-form-item>
				<el-form-item label="邮箱账号" prop="email">
					<el-input type="email" v-model="form.email"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code">
					<el-input v-model="form.code" style="width: 51%;"></el-input>
					<el-button v-show="show" type="primary" @click="email('form')" style="margin-left: 20px;">获取验证码
					</el-button>
					<el-button v-show="!show" type="primary" disabled style="margin-left: 20px;width: 112px;">{{count}}
					</el-button>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="resetForm('form')">取 消</el-button>
					<el-button type="primary" @click="saveEdit('form')">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import md5 from 'js-md5'
	import axios from 'axios'
	import Qs from 'qs'
	export default {
		data() {
			var uName = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('用户名不能为空'))
				} else {
					callback()
				}
			}
			let pwd = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('密码不能为空'))
				} else {
					callback()
				}
			}
			let email = (rule, value, callback) => {
				let np =
					/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
				if (value === '') {
					callback(new Error('邮箱不能为空'))
				} else if (value.search(np)) {
					callback(new Error('请输入正确的邮箱！'))
				} else {
					callback()
				}
			}
			let code = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('验证码不能为空'))
				} else {
					callback()
				}
			}
			return {
				param: {
					username: '',
					password: ''
				},
				editVisible: false,
				form: {
					uname: '',
					pwd: '',
					code: '',
					email: ''
				},
				rules: {
					uname: [{
						validator: uName,
						trigger: 'blur'
					}],
					pwd: [{
						validator: pwd,
						trigger: 'blur'
					}],
					email: [{
						validator: email,
						trigger: 'blur'
					}],
					code: [{
						validator: code,
						trigger: 'blur'
					}]
				},
				show: true,
				count: '',
				timer: null,
			}
		},
		methods: {
			login() {
				let uname = this.param.username
				let pwd = md5(this.param.password + this.param.username)
				let data = {
					uname,
					pwd
				}
				axios({
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
						'token': 'huxinhai'
					},
					transformRequest: [function(data) { //在请求之前对data传参进行格式转换
						data = Qs.stringify(data)
						return data
					}],
					url: 'api/login', //接口地址
					method: 'post', //请求类型
					params: {},
					data: {
						'uname': uname,
						'pwd': pwd
					}
				}).then(res => {
					if (res.data.code == 200) {
						localStorage.usertest = JSON.stringify(res.data)
						this.$router.push("/");
					} else {
						this.$message(res.data);
					}
				})
			},
			resetForm(formName) {
				this.editVisible = false
				this.$refs[formName].resetFields();
				Object.keys(this.form).forEach(key => this.form[key] = '')
				this.show = true
				clearInterval(this.timer)
				this.timer = null
			},
			register() {
				this.editVisible = true
				console.log(hex_md5('123'))
			},
			saveEdit(formName) {
				let form = this.form
				let pwd = md5(form.pwd + form.uname)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log(valid)
						axios.get('api/register',{
							params:{
								uname:form.uname,
								code:form.code,
								pwd
							}
						}).then(data=>{
							if(data.data == '注册成功'){
								this.editVisible = false
								this.$refs[formName].resetFields();
								Object.keys(this.form).forEach(key => this.form[key] = '')
								this.show = true
								clearInterval(this.timer)
								this.timer = null
							}
							this.$message(data.data);
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			email(formName) {
				let flge = false
				this.$refs[formName].validateField(['uname', 'pwd', 'email'], (valid) => {
					console.log(valid)
					if (valid) {
						flge = false
					} else {
						console.log('error submit!!');
						flge = true
						return false;
					}
				});
				if (flge) {
					let form = this.form
					axios.get('api/email', {
						params: {
							email: form.email,
							uname: form.uname
						}
					}).then(data => {
						if (data.data == '验证码已发送！') {
							const TIME_COUNT = 60
							if (!this.timer) {
								this.count = TIME_COUNT
								this.show = false
								this.timer = setInterval(() => {
									if (this.count > 0 && this.count <= TIME_COUNT) {
										this.count--
									} else {
										this.show = true
										clearInterval(this.timer)
										this.timer = null
									}
								}, 1000)
							}
						}
						this.$message(data.data);
					})
				}
			}
		}
	};
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: url(../assets/img/login-bg.jpg);
		background-size: 100%;
	}

	.ms-title {
		width: 100%;
		line-height: 50px;
		text-align: center;
		font-size: 20px;
		color: #fff;
		border-bottom: 1px solid #ddd;
	}

	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 350px;
		margin: -190px 0 0 -175px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.3);
		overflow: hidden;
	}

	.ms-content {
		padding: 30px 30px;
	}

	.login-btn {
		text-align: center;
	}

	.login-btn button {
		width: 100%;
		height: 36px;
		margin-bottom: 10px;
	}

	.login-tips {
		font-size: 12px;
		line-height: 30px;
		color: #fff;
		cursor: pointer;
	}
</style>
