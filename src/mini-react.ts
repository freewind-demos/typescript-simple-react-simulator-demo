// 当前组件的实例
let currentComponent: any = null;

// 保存所有组件的状态
const componentStates = new Map();

// 组件类型到实例的映射
const componentInstances = new Map();

// Fragment组件
export const Fragment = Symbol('Fragment');

// 获取或创建组件实例
function getComponentInstance(type: Function) {
  if (!componentInstances.has(type)) {
    componentInstances.set(type, {});
  }
  return componentInstances.get(type);
}

// 获取组件的状态
function getComponentState(component: any) {
  if (!componentStates.has(component)) {
    componentStates.set(component, {
      hooks: [],
      hookIndex: 0,
      effects: [],
      cleanup: [],
      mounted: false,
    });
  }
  return componentStates.get(component);
}

// 创建元素（虚拟DOM）
/**
 * createElement - 创建虚拟DOM元素
 * 这个函数是JSX转换的核心，JSX代码会被转换为对这个函数的调用
 * @param type - 元素类型（HTML标签名、组件函数或Fragment）
 * @param props - 元素属性
 * @param children - 子元素
 */
export function createElement(type: any, props: any, ...children: any[]) {
  return {
    type,
    props: {
      ...props,
      children: children.flat().map(child =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}

// 创建文本元素
function createTextElement(text: string) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

// 渲染函数
/**
 * render - 渲染函数
 * 将虚拟DOM渲染到真实DOM中
 * @param element - 要渲染的虚拟DOM元素
 * @param container - 容器DOM节点
 */
export function render(element: any, container: any) {
  if (element.type === 'TEXT_ELEMENT') {
    container.textContent = element.props.nodeValue;
    return;
  }

  // 处理Fragment
  if (element.type === Fragment) {
    element.props.children.forEach((child: any) => render(child, container));
    return;
  }

  const dom =
    element.type === 'div' || element.type === 'button'
      ? document.createElement(element.type)
      : document.createElement('div');

  // 处理props
  const isProperty = (key: string) => key !== 'children' && key !== 'ref';
  Object.keys(element.props || {})
    .filter(isProperty)
    .forEach(name => {
      if (name.startsWith('on')) {
        // 处理事件
        const eventType = name.toLowerCase().substring(2);
        dom.addEventListener(eventType, element.props[name]);
      } else {
        // 处理普通属性
        (dom as any)[name] = element.props[name];
      }
    });

  // 如果是函数组件
  if (typeof element.type === 'function') {
    // 获取或创建组件实例
    const componentInstance = getComponentInstance(element.type);
    currentComponent = componentInstance;
    const state = getComponentState(componentInstance);
    state.hookIndex = 0;
    
    // 执行组件函数获取元素
    const children = element.type(element.props);
    
    // 处理effects
    if (!state.mounted) {
      state.effects.forEach((effect: any) => {
        if (effect.cleanup) effect.cleanup();
        const cleanup = effect.callback();
        if (cleanup) effect.cleanup = cleanup;
      });
      state.mounted = true;
    }
    
    // 处理ref
    if (element.props?.ref) {
      element.props.ref.current = dom;
    }
    
    render(children, dom);
  } else {
    // 渲染子元素
    element.props?.children?.forEach((child: any) => render(child, dom));
  }

  container.appendChild(dom);
}

// useState钩子
/**
 * useState - 状态管理Hook
 * 允许函数组件保持状态，并在状态更新时触发重新渲染
 * @param initialValue - 状态的初始值
 * @returns [当前状态值, 更新状态的函数]
 */
export function useState<T>(initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const component = currentComponent;
  const state = getComponentState(component);
  const hookIndex = state.hookIndex++;

  if (state.hooks.length === hookIndex) {
    state.hooks.push(initial);
  }

  const setState = (value: T | ((prev: T) => T)) => {
    const nextValue = typeof value === 'function'
      ? (value as (prev: T) => T)(state.hooks[hookIndex])
      : value;

    if (state.hooks[hookIndex] === nextValue) return; // 避免不必要的更新
    
    console.log('State updating:', {
      currentValue: state.hooks[hookIndex],
      nextValue
    });
    
    state.hooks[hookIndex] = nextValue;
    
    // 触发重新渲染
    const root = document.getElementById('root');
    if (root) {
      console.log('Rerendering...');
      root.innerHTML = '';
      render(window.__lastElement, root);
    }
  };

  return [state.hooks[hookIndex], setState];
}

// useEffect钩子
/**
 * useEffect - 副作用Hook
 * 用于处理组件的副作用，如订阅、定时器、DOM操作等
 * @param effect - 副作用函数
 * @param deps - 依赖数组，只有依赖变化时才重新执行effect
 */
export function useEffect(callback: () => void | (() => void), deps?: any[]) {
  const component = currentComponent;
  const state = getComponentState(component);
  const hookIndex = state.hookIndex++;

  const hook = state.hooks[hookIndex];
  const hasNoDeps = !deps;
  const hasChangedDeps = !hook?.deps
    ? true
    : !deps?.every((dep: any, i: number) => dep === hook.deps[i]);

  if (hasNoDeps || hasChangedDeps) {
    state.effects.push({ callback, cleanup: null });
    state.hooks[hookIndex] = { deps };
  }
}

// useRef钩子
/**
 * useRef - 引用Hook
 * 创建一个可变的引用对象，在组件的整个生命周期内保持不变
 * @param initialValue - 引用的初始值
 */
export function useRef<T>(initial: T) {
  const component = currentComponent;
  const state = getComponentState(component);
  const hookIndex = state.hookIndex++;

  if (state.hooks.length === hookIndex) {
    state.hooks.push({ current: initial });
  }

  return state.hooks[hookIndex];
}

// useMemo钩子
/**
 * useMemo - 记忆化Hook
 * 缓存计算结果，只有依赖变化时才重新计算
 * @param factory - 计算函数
 * @param deps - 依赖数组
 */
export function useMemo<T>(factory: () => T, deps: any[]): T {
  const component = currentComponent;
  const state = getComponentState(component);
  const hookIndex = state.hookIndex++;

  const hook = state.hooks[hookIndex];
  const hasChangedDeps = !hook?.deps
    ? true
    : !deps?.every((dep: any, i: number) => dep === hook.deps[i]);

  if (!hook || hasChangedDeps) {
    const value = factory();
    state.hooks[hookIndex] = { value, deps };
    return value;
  }

  return hook.value;
}

declare global {
  interface Window {
    __lastElement: any;
  }
}
