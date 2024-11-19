import { createElement, Fragment, useState, useEffect, useRef, useMemo } from './mini-react';

// Hello组件
function Hello(): JSX.Element {
  // 使用useState管理计数器状态
  const [count, setCount] = useState<number>(0);
  
  // 使用useRef保存按钮引用
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  // 使用useMemo计算count的平方
  const squaredCount = useMemo<number>(() => {
    return count * count;
  }, [count]);
  
  // 使用useEffect在count变化时输出日志
  useEffect(() => {
    console.log('Count changed to:', count);
    console.log('Squared count is:', squaredCount);
  }, [count, squaredCount]);
  
  // 点击处理函数
  const handleClick = () => {
    console.log('Button clicked, current count:', count);
    setCount(prev => prev + 1);
  };
  
  // 返回JSX
  return (
    <div style="padding: 20px;">
      <h1>计数器示例</h1>
      <button
        onClick={handleClick}
        style="padding: 10px; margin: 10px 0;"
        ref={buttonRef}
      >
        点击次数: {count}
      </button>
      <p style="margin-top: 10px;">计数的平方: {squaredCount}</p>
    </div>
  );
}

export default Hello;
