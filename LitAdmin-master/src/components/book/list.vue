<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
        <el-breadcrumb-item>SDK管理</el-breadcrumb-item>
        <el-breadcrumb-item>SDK列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main" v-loading="loading" element-loading-text="拼命加载中">
      <!--工具条-->
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-input v-model="filters.name" placeholder="书名" @keyup.enter.native="handleSearch"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" v-on:click="handleSearch">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="showAddDialog">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>

      <!--列表-->
      <el-table :data="books" highlight-current-row @selection-change="selsChange"
                style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="[图书简介]">
                <span>{{ props.row.description }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="Name" label="sdk名称" sortable></el-table-column>
        <el-table-column prop="Author" label="作者" width="100" sortable></el-table-column>
        <el-table-column prop="Platform" label="平台" width="150" sortable></el-table-column>
        <el-table-column prop="UploadTime" label="上传时间" width="150" sortable></el-table-column>
        <el-table-column prop="SDKVer" label="版本号" width="150" sortable></el-table-column>
        <el-table-column prop="DwnCount" label="下载数量" width="150" sortable></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
            <el-button type="danger" @click="delBook(scope.$index,scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-button type="danger" @click="batchDeleteBook" :disabled="this.sels.length===0">批量删除</el-button>
        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10" :total="total"
                       style="float:right;">
        </el-pagination>
      </el-col>

      <el-dialog title="编辑" :visible.sync ="editFormVisible" :close-on-click-modal="false">
        <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
          <el-form-item label="sdk名称" prop="Name">
            <el-input v-model="editForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="Author">
            <el-input v-model="editForm.Author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="平台" prop="Platform">
            <el-input v-model="editForm.Platform" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="editForm.UploadTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="版本号" prop="SDKVer">
            <el-input v-model="editForm.SDKVer" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="下载量" prop="DwnCount">
            <el-input v-model="editForm.DwnCount" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="描述" prop="Desc">
            <el-input type="textarea" v-model="editForm.Desc" :rows="8"></el-input>
          </el-form-item>



        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit">提交</el-button>
        </div>
      </el-dialog>


      <!--新增界面-->
      <!-- <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
          <el-form-item label="sdk名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="author">
            <el-input v-model="addForm.author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.publishAt"></el-date-picker>
          </el-form-item>
          <el-form-item label="简介" prop="Desc">
            <el-input type="textarea" v-model="addForm.description" :rows="8"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
      </el-dialog> -->

            <!--新增界面-->
      <el-dialog title="新增" :visible.sync ="addFormVisible" :close-on-click-modal="false">
        <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">

          <el-form-item label="sdk名称" prop="Name">
            <el-input v-model="addForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="Author">
            <el-input v-model="addForm.Author" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="平台" prop="Platform">
            <el-input v-model="addForm.Platform" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="上传日期">
            <el-date-picker type="date" placeholder="选择日期" v-model="addForm.UploadTime"></el-date-picker>
          </el-form-item>
          <el-form-item label="版本号" prop="SDKVer">
            <el-input v-model="addForm.SDKVer" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="下载量" prop="DwnCount">
            <el-input v-model="addForm.DwnCount" auto-complete="off"></el-input>
          </el-form-item>
           <el-form-item label="描述" prop="Desc">
            <el-input type="textarea" v-model="addForm.Desc" :rows="8"></el-input>
          </el-form-item>
          <el-form-item label="文件ID" prop="Desc">
            <el-input type="textarea" v-model="fileId" :rows="2"></el-input>
          </el-form-item>


          <el-upload
            class="upload-demo"
            action=""
            :before-upload="beforeUpload"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
        </div>
         </el-dialog>

    </el-col>
  </el-row>
</template>
<script>
  import util from '../../common/util'
  import API from '../../api/api_book';

  export default{
    data(){
      return {
        doUpload:'/api/up/file',
        pppss:{
            srid:''
        },
        filters: {
          name: ''
        },
        books: [],
        total: 0,
        page: 1,
        limit: 10,
        loading: false,
        sels: [], //列表选中列
        fileId: 0,

        //编辑相关数据
        editFormVisible: false,//编辑界面是否显示
        editFormRules: {
          Name: [
            {required: true, message: '请输入书名', trigger: 'blur'}
          ],
          Author: [
            {required: true, message: '请输入作者', trigger: 'blur'}
          ],
          // Desc: [
          //   {required: true, message: '请输入简介', trigger: 'blur'}
          // ]
        },
        editForm: {
          Id: '',
          Name: '',
          Author: '',
          Platform: '',
          UploadTime: '',
          SDKVer: '',
          DwnCount: '',
          Desc: ''          
        },

        //新增相关数据
        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          // name: [
          //   {required: true, message: '请输入书名', trigger: 'blur'}
          // ],
          // author: [
          //   {required: true, message: '请输入作者', trigger: 'blur'}
          // ],
          description: [
            {required: true, message: '请输入简介', trigger: 'blur'}
          ]
        },
        addForm: {
          Name: '',
          Author: '',
          Platform: '',
          UploadTime: '',
          SDKVer: '',
          DwnCount: '',
          Desc: '',
          FileId: '' 
        }
      }
    },
    methods: {
    beforeUpload (file) {
      let that = this;
      console.log("\n 文件上传组建 \n")
      console.log(file)
      let fd = new FormData()
      fd.append('file', file)
      // console.log(fd)
      API.uploadFile(fd).then(function(result){
       console.log("文件上传完成ID:",result);
      if (result) {
            console.log("开始显示list")
             that.fileId = result
             that.addForm.FileId = result
             console.log('this文件id',that.addForm.FileId)
          }

     },function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
      }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
      });
      return true
    },

      handleCurrentChange(val) {
        this.page = val;
        this.search();
      },
      handleSearch(){
        this.total = 0;
        this.page = 1;
        this.search();
      },
      search(){
        let that = this;
        let params = {
          page: that.page,
          limit: 10,
          name: that.filters.name
        };

        that.loading = true;
        API.findList(params).then(function (result) {
          that.loading = false;
          console.log("sdk数据查询返回:",result);
          if (result) {
            console.log("开始显示list")
            that.total = result.total;
            that.books = result;
          }
        }, function (err) {
          that.loading = false;
          that.$message.error({showClose: true, message: err.toString(), duration: 2000});
        }).catch(function (error) {
          that.loading = false;
          console.log(error);
          that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //删除
      delBook: function (index, row) {
        let that = this;
        this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
          that.loading = true;
          console.log("删除id:",row)
          API.remove('{"Id":'+row.Id+"}").then(function (result) {
            that.loading = false;
            if (result === "success") {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {
        });
      },
      //显示编辑界面
      showEditDialog: function (index, row) {
        this.editFormVisible = true;
        this.editForm = Object.assign({}, row);
      },
      //编辑
      editSubmit: function () {
        let that = this;
        this.$refs.editForm.validate((valid) => {
          // if (valid) {
            this.loading = true;
            let para = Object.assign({}, this.editForm);
            console.log("时间处理之前：",para)
             para.UploadTime = (!para.UploadTime || para.UploadTime === '') ? '' : util.formatDate.format(new Date(para.UploadTime), 'yyyy-MM-dd');
            // para.UploadTime = util.formatDate.format(new Date(para.formatDate), 'yyyy-MM-dd');
            
            API.update(para).then(function (result) {
              console.log("更新参数：",para)
              that.loading = false;
              // if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '修改成功', duration: 2000});
                that.$refs['editForm'].resetFields();
                that.editFormVisible = false;
                that.search();
              // } else {
                // that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              // }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });
          // }
        });
      },
      showAddDialog: function () {
        this.addFormVisible = true;
        this.addForm = {
          Name: '',
          Author: '',
          Platform: '',
          UploadTime: '',
          SDKVer: '',
          DwnCount: '',
          Desc: ''
        };
      },
      //新增
      addSubmit: function () {
        let that = this;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            that.loading = true;
            this.addForm.FileId = this.fileId
            let para = Object.assign({}, this.addForm);
            para.UploadTime = (!para.UploadTime || para.UploadTime === '') ? '' : util.formatDate.format(new Date(para.UploadTime), 'yyyy-MM-dd');
            console.log("上传参数:",para)
            API.add(para).then(function (result) {
              that.loading = false;
              // if (result && parseInt(result.errcode) === 0) {
                that.$message.success({showClose: true, message: '新增成功', duration: 2000});
                that.$refs['addForm'].resetFields();
                that.addFormVisible = false;
                that.search();
                that.fileId = 0;
              // } else {
              //   that.$message.error({showClose: true, message: '修改失败', duration: 2000});
              // }
            }, function (err) {
              that.loading = false;
              that.$message.error({showClose: true, message: err.toString(), duration: 2000});
            }).catch(function (error) {
              that.loading = false;
              console.log(error);
              that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
            });

          }
        });
      },
      //批量删除
      batchDeleteBook: function () {
        let ids = this.sels.map(item => item.id).toString();
        let that = this;
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          that.loading = true;
          API.removeBatch(ids).then(function (result) {
            that.loading = false;
            if (result && parseInt(result.errcode) === 0) {
              that.$message.success({showClose: true, message: '删除成功', duration: 1500});
              that.search();
            }
          }, function (err) {
            that.loading = false;
            that.$message.error({showClose: true, message: err.toString(), duration: 2000});
          }).catch(function (error) {
            that.loading = false;
            console.log(error);
            that.$message.error({showClose: true, message: '请求出现异常', duration: 2000});
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.handleSearch()
    }
  }
</script>

<style>
  .demo-table-expand label {
    font-weight: bold;
  }
</style>
