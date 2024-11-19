import { createElement, render } from './mini-react';
import Hello from './Hello';

// 创建根元素
const element = <Hello />;

// 保存最后渲染的元素，用于重新渲染
window.__lastElement = element;

// 渲染到root元素
const root = document.getElementById('root');
if (root) {
  render(element, root);
}
