/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  httpAgentOptions: {
    keepAlive: true,
  },
}

module.exports = nextConfig
