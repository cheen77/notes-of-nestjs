<template>
  <div class="wraps">
    <div>
      <el-input v-model="search.keyWord" style="width: 300px"></el-input>
      <el-button @click="init" style="margin-left: 10px">搜索</el-button>
      <el-button @click="openDialog" type="primary" style="margin-left: 10px"
        >添加</el-button
      >
    </div>
    <el-table border :data="tableData" style="width: 100%; margin-top: 30px">
      <el-table-column prop="name" label="名字" />
      <el-table-column prop="desc" label="描述" />
      <el-table-column prop="id" label="id" />
      <el-table-column>
        <template #default="scope">
          <el-button @click="edit(scope.row)">编辑</el-button>
          <el-button @click="deleteRow(scope.row)">删除</el-button>
          <el-button @click="openDialogOneToOne(scope.row)"
            >添加一对一</el-button
          >
          <el-button @click="openDialogOneToMany(scope.row)"
            >添加一对多</el-button
          >
          <el-button @click="(isShowTag = true), (row = scope.row)"
            >添加 多对多</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="changeSize"
      style="float: right; margin-top: 10px"
      background
      layout="prev, pager, next"
      :total="total"
    />
  </div>

  <el-dialog v-model="dialogVisible" title="弹框" width="50%">
    <el-form :model="form">
      <el-form-item prop="name" label="名称">
        <el-input v-model="form.name" placeholder="名称" />
      </el-form-item>
      <el-form-item prop="desc" label="描述">
        <el-input v-model="form.desc" placeholder="描述"> </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="save"> 保存 </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowOneToOne" title="一对一 添加身份认证" width="700px">
    <el-form :model="oneToOneForm" label-width="100px">
      <el-form-item prop="name" label="名称">
        <el-input v-model="oneToOneForm.name" placeholder="名称" />
      </el-form-item>
      <el-form-item prop="code" label="身份证号">
        <el-input v-model="oneToOneForm.code" placeholder="身份证号">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="oneToOne" type="primary">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowOneToMany" title="一对多 添加银行卡" width="700px">
    <el-form :model="oneToManyForm" label-width="100px">
      <el-form-item prop="name" label="卡名称">
        <el-input v-model="oneToManyForm.name" placeholder="卡名称" />
      </el-form-item>
      <el-form-item prop="code" label="卡号">
        <el-input v-model="oneToManyForm.cardNumber" placeholder="卡号">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="oneToMany" type="primary">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowTag" title="多对多 添加游戏">
    <el-select style="width: 100%" v-model="tags" multiple>
      <el-option value="cf">cf</el-option>
      <el-option value="dnf">dnf</el-option>
      <el-option value="csgo">csgo</el-option>
    </el-select>
    <template #footer>
      <el-button @click="manyToMany" type="primary">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  addUser,
  updateUser,
  delUser,
  getList,
  oneToOneApi,
  oneToManyApi,
  manyToManyApi,
} from "@/api/index";
const total = ref<number>(0);
//搜索框
const search = reactive({
  keyWord: "",
  page: 1,
  pageSize: 10,
});
//表单
const form = reactive({
  name: "",
  desc: "",
  id: 0,
});
//清空数据
const resetForm = reactive({ ...form });
//表格数据
const tableData = ref([]);
//弹框开关
const dialogVisible = ref<boolean>(false);
const openDialog = () => {
  dialogVisible.value = true;
  Object.assign(form, resetForm);
};
//初始化表格数据
const init = async () => {
  const list = await getList(search);
  tableData.value = list?.data ?? [];
  total.value = list?.total ?? 0;
};
init();
const changeSize = (page) => {
  search.page = page;
  init();
};
//保存 和修改 表格数据
const save = async () => {
  if (form.id) {
    await updateUser(form);
  } else {
    await addUser(form);
  }

  close();
  init();
};
//删除表格数据
const deleteRow = async (row) => {
  await delUser({ id: row.id });
  init();
};
//获取 详情
const edit = (row: any) => {
  dialogVisible.value = true;
  Object.assign(form, row);
};
//关闭弹框
const close = () => {
  dialogVisible.value = false;
};

const isShowOneToOne = ref<boolean>(false);

const oneToOneForm = reactive({
  name: "",
  code: 0,
  id: "",
});

const openDialogOneToOne = (row: any) => {
  isShowOneToOne.value = true;
  Object.assign(oneToOneForm, { id: row.id, name: row.name, code: row.code });
  console.log("oneToOneForm", oneToOneForm);
};

const oneToOne = async (row: any) => {
  await oneToOneApi(oneToOneForm);
  isShowOneToOne.value = false;
};

const isShowOneToMany = ref<boolean>(false);

const oneToManyForm = reactive({
  name: "",
  cardNumber: null,
  id: "",
});

const openDialogOneToMany = (row: any) => {
  isShowOneToMany.value = true;
  Object.assign(oneToManyForm, { id: row.id });
};

const oneToMany = async () => {
  await oneToManyApi(oneToManyForm);
  isShowOneToMany.value = false;
};

const row = ref<{
  id?: number;
  name?: string;
  desc?: string;
  createTime?: Date;
}>({});
const tags = ref<string[]>([]);
const isShowTag = ref<boolean>(false);
const manyToMany = async () => {
  const res = await manyToManyApi({
    tags: tags.value,
    userId: row.value.id,
  });
  isShowTag.value = false;
  tags.value = [];
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}

html,
body {
  background: #ccc;
}

.wraps {
  height: 100vh;
  padding: 30px;
}
</style>
