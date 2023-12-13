/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:54:14
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-05 22:59:30
 * @Description: 字体文件列表
 */

const cnList = [
  {
    name: '汉体',
    fontFamily: '汉体',
  },
  {
    name: '华康金刚黑',
    fontFamily: '华康金刚黑',
  },
];
document.addEventListener('DOMContentLoaded', function () {
  // Find the element with the specified class
  const colorPickerInput = document.querySelector('.ivu-color-picker-input.ivu-input.ivu-input-default');

  // Check if the element exists before attempting to trigger the click event
  if (colorPickerInput) {
    // Programmatically trigger a click event on the element
    colorPickerInput.click();
  }
});

const enList = [];

export default [...cnList, ...enList];

