type RazorpayConstructorOptions = Record<string, unknown>

interface Window {
  Razorpay: new (options: RazorpayConstructorOptions) => { open(): void }
}
