import SvgIcon from "@/components/SvgIcon/SvgIcon";
/**
 * 自动加载svg
 * @param {Vue 对象} app
 */
export default function autoLoadingSvg(app) {
  // 全局注册 SvgIcon组件
  app.component("svg-icon", SvgIcon);
  const req = require.context("./svg", false, /\.svg$/);
  const requireAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  requireAll(req);
}
