/// <reference types="react-scripts" />

declare module '*.module.less' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.png' {
  const value: string
  export = value;
}

declare module '*.jpg' {
  const value: string
  export = value;
}

declare module '*.svg' {
  const content: any

  export default content
}
