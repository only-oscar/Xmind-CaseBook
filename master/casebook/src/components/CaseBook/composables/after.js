/**
 * 后端处理数据的方法
 */
import { getBill } from "@/api/after.js";
import { reactive } from "vue";
import { ElMessage } from "element-plus";

export default function afterEndHandle() {
  let methods = reactive({
    // 获取账单列表
    getBills: async (month, type, category) => {
      let result = await getBill(month, type, category);
      if (result.status === 200) {
        if (result.data.length === 0) {
          ElMessage({
            type: "info",
            message: "没有查询到对应账单",
          });
        } else {
          ElMessage({
            type: "success",
            message: "获取账单列表成功",
          });
        }
        return result.data;
      }
      ElMessage({
        type: "error",
        message: "获取账单列表失败",
      });
      return [];
    },
  });

  return {
    methods,
  };
}
