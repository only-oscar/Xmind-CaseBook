import {
    ElButton,
    ElSelect,
    ElOption,
    ElMenu,
    ElContainer,
    ElAside,
    ElMenuItem,
    ElTable,
    ElTableColumn,
    ElCard,
    ElDialog,
    ElForm,
    ElFormItem,
    ElDatePicker,
    ElInput,
    ElEmpty,
    ElCol,
    ElRow,
  } from "element-plus";
  import "element-plus/dist/index.css";
  export default function loadingComponent(app) {
    app.use(ElButton);
    app.use(ElSelect);
    app.use(ElOption);
    app.use(ElMenu);
    app.use(ElContainer);
    app.use(ElAside);
    app.use(ElMenuItem);
    app.use(ElTable);
    app.use(ElTableColumn);
    app.use(ElCard);
    app.use(ElDialog);
    app.use(ElForm);
    app.use(ElFormItem);
    app.use(ElInput);
    app.use(ElEmpty);
    app.use(ElDatePicker);
    app.use(ElCol);
    app.use(ElRow);
  }
  