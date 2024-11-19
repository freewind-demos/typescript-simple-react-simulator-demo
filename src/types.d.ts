declare namespace JSX {
  interface IntrinsicElements {
    div: {
      style?: string;
      children?: any;
      [key: string]: any;
    };
    button: {
      onClick?: (event: MouseEvent) => void;
      style?: string;
      ref?: any;
      children?: any;
      [key: string]: any;
    };
    h1: {
      children?: any;
      [key: string]: any;
    };
    p: {
      style?: string;
      children?: any;
      [key: string]: any;
    };
  }
}
