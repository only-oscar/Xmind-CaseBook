import { reactive, ref } from "vue";
import { createBill } from "@/api/common";
import { ElMessage } from "element-plus";
import { checkNumberValidator } from "@/utils/validate";

export default function addDialog(callback) {
  const addDialogVisible = ref(false); // 添加表单是否可见 ，默认不可见
  const addCateSelector = ref(true);
  const addForm = ref({
    type: "",
    category: "",
    time: "",
    amount: 0,
  });
  const addFormRef = ref(null);
  // 验证规则
  const addFormRules = ref({
    type: [
      {
        required: true,
        message: "请选择账单类型",
        trigger: "change",
      },
    ],
    category: [
      {
        required: true,
        message: "请选择账单分类",
        trigger: "change",
      },
    ],
    time: [
      {
        required: true,
        message: "请选择录入时间",
        trigger: "change",
      },
    ],
    amount: [
      {
        required: true,
        message: "请输入账单金额",
        trigger: "blur",
      },
      {
        validator: checkNumberValidator,
        trigger: "blur",
      },
    ],
  });

  const addFormMethod = reactive({
    // 打开添加对话框
    openAddDialog: () => {
      addDialogVisible.value = true;
    },
    // 关闭添加对话框
    closeAddDialog: () => {
      addFormRef.value.resetFields();
      addCateSelector.value = true;
    },
    // 选择type值，出现2级选择分类对话框
    changeAddType: () => {
      addCateSelector.value = false;
    },
    addBill: () => {
      addFormRef.value.validate(async (valid) => {
        // 如果检验失败就不发送请求
        if (!valid) return false;
        addForm.value["time"] = new Date(addForm.value["time"]).getTime(); // 获取时间戳
        let result = await createBill(addForm.value);
        if (result.status == 200) {
          // 重置
          addFormRef.value.resetFields();
          addDialogVisible.value = false;
          addCateSelector.value = true;
          callback();
        } else {
          ElMessage({
            type: "error",
            message: "添加账单失败",
          });
        }
      });
    },
    resetAddForm: () => {
      addFormRef.value.resetFields();
      addCateSelector.value = true;
    },
  });
  return {
    addDialogVisible,
    addCateSelector,
    addForm,
    addFormRef,
    addFormRules,
    addFormMethod,
  };
}
