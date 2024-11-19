# TypeScript React 模拟器

这是一个用 TypeScript 实现的简单 React 模拟器，用于学习和理解 React 的核心原理。该项目通过实现一个最小化版本的 React，帮助开发者深入理解 React 的工作机制。

## 项目目的

1. 深入理解 React 的核心概念
2. 学习 Virtual DOM 的工作原理
3. 理解 React Hooks 的实现机制
4. 掌握 JSX 转换原理
5. 学习组件渲染和更新流程

## 核心特性

### 1. Virtual DOM
- 实现了 `createElement` 函数，支持 JSX 语法
- 支持组件的嵌套渲染
- 实现了 Fragment 组件

### 2. Hooks 实现
- useState: 状态管理
  - 支持初始值设置
  - 支持函数式更新
  - 自动触发重渲染
- useEffect: 副作用处理
  - 支持依赖数组
  - 支持清理函数
  - 条件执行
- useRef: 引用管理
  - 跨渲染周期保持引用
  - DOM 节点引用
- useMemo: 计算缓存
  - 依赖比较
  - 条件重计算

### 3. 渲染系统
- 支持函数组件
- 支持属性传递
- 支持事件处理
- 支持样式设置

## 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm start
```

### 构建生产版本
```bash
pnpm build
```

## 项目结构

```
src/
  ├── mini-react.ts    # React 核心实现
  ├── Hello.tsx        # 示例组件
  ├── main.tsx         # 入口文件
  └── types.d.ts       # TypeScript 类型声明
```

## 示例代码

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

## 学习要点

1. JSX 转换
   - JSX 如何被转换为 `createElement` 调用
   - 属性和子元素的处理

2. 组件渲染
   - 虚拟 DOM 的创建和更新
   - 组件实例的管理
   - 属性的传递和处理

3. Hooks 原理
   - Hook 状态的存储方式
   - 组件实例与 Hook 的关联
   - 依赖追踪机制

4. 更新机制
   - 状态更新触发重渲染
   - 虚拟 DOM 比对（简化版）
   - 副作用的执行时机

## 局限性

这是一个教育性质的项目，为了保持代码简单和易于理解，有以下局限：

1. 没有实现完整的虚拟 DOM diff 算法
2. 不支持类组件
3. 重渲染时会重建整个 DOM 树
4. 部分 React 特性未实现（如 Context、错误边界等）

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 许可

MIT
