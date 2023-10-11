/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  //swcMinify: true, // ver12以降デフォルトで有効
  experimental: {
    instrumentationHook: true,
    // newNextLinkBehavior: true,
  },
}

module.exports = nextConfig
