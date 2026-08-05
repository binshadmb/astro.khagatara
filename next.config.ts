/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ?? '',
  },
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
