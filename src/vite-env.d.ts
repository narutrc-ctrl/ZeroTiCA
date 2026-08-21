/// <reference types="vite/client" />

export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

declare module "*.png" {
  const src: string;
  export default src;
}
