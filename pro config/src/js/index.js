/*
 * @Description: fn
 * @Author: Amy
 * @Date: 2022-06-15 11:34:08
 * @LastEditTime: 2022-06-15 15:05:10
 */
import "../style/index.less";
import "../style/index.css";
import "../style/index.scss";
import "@babel/polyfill";

function add(a, b) {
  return a + b;
}
// eslint-disable-next-line 下一行不进行 eslint 检查
console.log(add(1, 2));
