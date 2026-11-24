export {};

declare global {
  interface Window {
    /** Razorpay Checkout instance constructor, injected by checkout.js. */
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on?: (event: string, handler: (response: any) => void) => void;
      close?: () => void;
    };
  }
}
