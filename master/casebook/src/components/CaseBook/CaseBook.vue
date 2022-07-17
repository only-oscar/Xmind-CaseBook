<template>
  <div class="record" style="margin: 0 auto">
    <div class="find">
      <el-row justify="center">
        <el-form label-width="100px" :model="findForm" ref="findFormRef" :inline="true">
          <el-form-item label="账单月份" prop="month">
            <el-date-picker
              v-model="findForm.month"
              type="month"
              placeholder="选择月份"
            />
          </el-form-item>
          <el-form-item label="账单类型" prop="type">
            <el-select
              v-model="findForm.type"
              placeholder="选择类型"
              @change="changeType"
            >
              <el-option
                v-for="item in typeInfos"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="账单分类" prop="category">
            <el-select
              v-model="findForm.category"
              placeholder="选择分类"
              :disabled="categorySelector"
            >
              <el-option
                v-for="item in categoryInfos"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row justify="space-between">
        <span class="income"
          >账单收入:{{
            numAdd(income, pay < 0 ? Math.abs(pay) : 0) > 0
              ? numAdd(income, pay < 0 ? Math.abs(pay) : 0)
              : 0
          }}
          ¥</span
        >

        <el-button type="warning" @click="resetFindForm">重置</el-button>
        <el-button type="primary" @click="openAmountDialog">支出细则</el-button>
        <el-button type="primary" @click="openAddDialog">添加账单</el-button>
        <el-button type="success" @click="submitFindForm">查询</el-button>

        <span class="pay"
          >账单支出:{{
            numAdd(pay, income < 0 ? Math.abs(income) : 0) > 0
              ? numAdd(pay, income < 0 ? Math.abs(income) : 0)
              : 0
          }}
          ¥</span
        >
      </el-row>
    </div>
    <el-table
      :data="billInfos"
      style="width: 100%"
      :header-cell-style="{ 'text-align': 'center' }"
      :cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column label="记账时间" prop="time" />
      <el-table-column label="账单类型" prop="type" />
      <el-table-column label="账单分类" prop="category" />
      <el-table-column label="账单金额/¥" prop="amount" />
    </el-table>
  </div>

  <!-- 添加表单 -->
  <el-dialog v-model="addDialogVisible" title="新增账单" center @close="closeAddDialog">
    <el-form :model="addForm" id="addView" ref="addFormRef" :rules="addFormRules">
      <el-form-item label="账单类型" prop="type">
        <el-select
          v-model="addForm.type"
          placeholder="请选择账单类型"
          @change="changeAddType"
        >
          <el-option
            v-for="item in typeInfos"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="账单分类" prop="category">
        <el-select
          v-model="addForm.category"
          placeholder="请选择账单分类"
          :disabled="addCateSelector"
        >
          <el-option
            v-for="item in categoryInfos"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="录入时间" prop="time">
        <el-date-picker
          v-model="addForm.time"
          type="datetime"
          placeholder="请选择录入时间"
        />
      </el-form-item>
      <el-form-item label="账单金额" prop="amount">
        <el-input v-model="addForm.amount" placeholder="请录入账单金额" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button @click="resetAddForm">重置</el-button>
        <el-button type="primary" @click="addBill">提交</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 支出细则对话框 -->
  <el-dialog v-model="amountDialogVisible" title="支出细则" center>
    <el-table :data="payInfos">
      <el-table-column property="category" label="账单分类" />
      <el-table-column property="amount" label="支出金额" />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { defineProps, ref, onMounted, toRefs, computed, toRaw } from "vue";
import moment from "moment";
import afterEndHandle from "./composables/after";
import frontEndHandle from "./composables/front";
import addDialog from "./composables/addDialog.js";
import numAdd from "@/utils/numAdd";
import amountDialog from "./composables/amountDialog";
import { Png2csv } from "csv2png";
import { getCateories } from "@/api/common";
import arrayToJson from "@/utils/ArraytoJson";

// 定义组件参数
const props = defineProps({
  mode: {
    type: String,
    required: true,
    default: "after",
  },
});
// 查询表单
const findForm = ref({
  month: 0,
  type: "",
  category: "",
});

const findFormRef = ref(null);

// 账单
const bills = ref([]);
// 分类列表
const categories = ref([]);
// 经过处理后的账单
const billInfos = computed(() => {
  let billArr = toRaw(bills.value);
  // 将账单列表参数形式化
  return billArr.map((bill) => {
    bill.time = moment(parseInt(bill.time)).format("YYYY-MM-DD HH:mm:ss");
    // 避免重复计算计算属性，导致技术属性出错的结果
    bill.type = bill.type == 1 || bill.type == "收入" ? "收入" : "支出";
    for (let category of categories.value) {
      if (bill.category == category.id) {
        bill.category = category.name;
        break;
      }
    }
    return bill;
  });
});
// 账单类型
const typeInfos = ref([
  {
    value: "0",
    label: "支出",
  },
  {
    value: "1",
    label: "收入",
  },
]);

// 分类类表是否禁用, 默认true
const categorySelector = ref(true);
const categoryInfos = computed(() => {
  let categoriesArr = [];
  for (let cate of categories.value) {
    if (findForm.value.type == cate.type || addForm.value.type == cate.type) {
      let category = {};
      category.value = cate.id;
      category.label = cate.name;
      categoriesArr.push(category);
    }
  }
  return categoriesArr;
});

// 收入与支出
const income = computed(() => {
  return bills.value.reduce((total, item) => {
    // 保留两位小数
    return item.type == 1 || item.type == "收入"
      ? numAdd(total, parseFloat(item.amount))
      : total;
  }, 0);
});

const pay = computed(() => {
  return bills.value.reduce((total, item) => {
    // console.log(total);
    return item.type == 0 || item.type == "支出"
      ? numAdd(total, parseFloat(item.amount))
      : total;
  }, 0);
});

let handleMode = null;
if (props.mode === "after") {
  // 区分模式，此处为后端处理模式
  handleMode = afterEndHandle();
} else {
  handleMode = frontEndHandle();
}

// 将methods 转化为普通对象
let { getBills } = { ...toRefs(handleMode.methods) };

// 添加操作逻辑
let {
  addDialogVisible,
  addForm,
  addFormRef,
  addFormRules,
  addFormMethod,
  addCateSelector,
} = addDialog(async function () {
  bills.value = await getBills.value(null, null, null, true);
});

const { openAddDialog, changeAddType, addBill, resetAddForm, closeAddDialog } = {
  ...toRefs(addFormMethod),
};

const { amountDialogVisible, amountMethods, payInfos } = amountDialog(bills, categories);
const { openAmountDialog } = { ...toRefs(amountMethods) };

// 选择账单类型后，可二级选择账单分类
function changeType() {
  findForm.value.category = ""; // 重置账单分类选项
  categorySelector.value = false; // 解禁
}

// 重置表单
async function resetFindForm() {
  findFormRef.value.resetFields(); // 重置表单
  categorySelector.value = true; // 禁用下拉框
  // 获取账单列表
  let result = await getBills.value();
  bills.value = result;
}

// 提交表单,查找
async function submitFindForm() {
  let result = await getBills.value(
    findForm.value.month,
    findForm.value.type,
    findForm.value.category
  );
  bills.value = result;
}

onMounted(async () => {
  // 必须写获取分类在获取账单列表，不然会重复计算两次计算属性
  // 获取分类压缩png
  let categoryResult = await getCateories();
  if (categoryResult.status === 200) {
    const pc = new Png2csv(categoryResult.data);
    let categoryArr = await pc.parse();
    let categoryJSON = arrayToJson(categoryArr);
    categories.value = categoryJSON;
  }

  // 获取账单列表
  bills.value = await getBills.value();
});
</script>

<style>
.record .el-form--inline .el-form-item {
  margin-right: 0;
}

.pay,
.income {
  line-height: 32px;
}

#addView .el-select {
  width: 100%;
}
</style>
