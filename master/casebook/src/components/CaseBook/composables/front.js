/**
 * 前端处理数据方法t
 */
import { getBill } from "@/api/front.js";
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import arrayToJson from "@/utils/ArraytoJson";
import { Png2csv } from "csv2png";
import _ from "lodash";

export default function frontEndHandle() {
  let bills = []; // 缓存数据
  let methods = reactive({
    // 获取账单列表
    getBills: async (month, type, category, flag = false) => {
      //   flag 判断是否更新缓存
      if (!bills.length || flag) {
        let result = await getBill();
        if (result.status === 200) {
          ElMessage({
            type: "success",
            message: "获取账单列表成功",
          });

          const pc = new Png2csv(result.data);
          let billArr = await pc.parse();
          let billJSON = arrayToJson(billArr);
          bills = _.cloneDeep(billJSON);
          // console.log(bills)
          return billJSON;
        }
        ElMessage({
          type: "error",
          message: "获取账单列表失败",
        });
        return [];
      } else {
        let result = await handleData(
          _.cloneDeep(bills),
          month,
          type,
          category
        );
        return result;
      }
    },
  });

  return {
    methods,
  };
}

function handleData(billsObj, month, type, category) {
  // console.log(billsObj);
  return Promise.resolve(billsObj)
    .then((bills) => {
      if (month) {
        // 过滤不符合月份的账单
        bills = bills.filter((bill) => {
          let y = new Date(parseInt(bill.time)).getFullYear();
          let m = new Date(parseInt(bill.time)).getMonth() + 1; // 获取当前月份
          let date = new Date(month);
          let dyear = date.getFullYear();
          let dmonth = date.getMonth() + 1;
          return m == dmonth && y == dyear;
        });
      }
      return bills;
    })
    .then((bills) => {
      if (type) {
        // 过滤不符合类型的账单
        bills = bills.filter((bill) => {
          if (type == "支出") {
            type = 0;
          } else if (type == "收入") {
            type = 1;
          }
          return bill.type == type;
        });
      }
      return bills;
    })
    .then((bills) => {
      if (category) {
        // 过滤不符合分类的账单
        bills = bills.filter((bill) => {
          return bill.category == category;
        });
      }
      //   console.log(bills);
      return bills;
    });
}
