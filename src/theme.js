// 导入主题文件
import defaultTheme from './themes/default';
import lightTheme from './themes/light';

// 导出主题对象
export { defaultTheme, lightTheme };

// 导出主题映射，方便通过名称访问主题
export const themeMap = {
  default: defaultTheme,
  light: lightTheme
};