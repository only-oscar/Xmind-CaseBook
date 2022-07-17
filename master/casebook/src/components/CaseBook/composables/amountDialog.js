import { computed, ref, reactive } from "vue";
import numAdd from "@/utils/numAdd";
import _ from "lodash";

export default function amountDialog(bills, categories) {
  const amountDialogVisible = ref(false); // 对话框是否可见 ，默认不可见
  const payInfos = computed(() => {
    let billsArr = Array.prototype.slice.call(bills.value, 0);
    let categoryArr = Array.prototype.slice.call(categories.value, 0);
    let result = {};
    // 过滤出支出账单
    billsArr = billsArr.filter((bill) => {
      return bill.type == 1 || bill.type == "支出";
    });

    for (let bill of billsArr) {
      for (let category of categoryArr) {
        // console.log(bill.category,category.id)
        // 账单分类是否相等
        if (bill.category == category.name) {
          if (!Object.prototype.hasOwnProperty.call(result, category.id)) {
            // 如果没有这个属性，则创建属性
            result[category.id] = {};
            result[category.id]["category"] = category.name;
            result[category.id]["amount"] = parseFloat(bill.amount);
          } else {
            // 如果存在这个属性，则相加
            result[category.id]["amount"] = numAdd(
              result[category.id]["amount"],
              parseFloat(bill.amount)
            );
          }
          break;
        }
      }
    }
    // 转化为数组并从小到大排序
    return _.values(result).sort(function fun(a, b) {
      return a["amount"] - b["amount"];
      //a-b可以控制让数组按照从小到大的排序
    });
  });

  const amountMethods = reactive({
    openAmountDialog: () => {
      amountDialogVisible.value = true;
    },
  });
  return {
    amountDialogVisible,
    payInfos,
    amountMethods,
  };
}
