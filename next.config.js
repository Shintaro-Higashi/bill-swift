/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config')

const nextConfig = {
  i18n,
  reactStrictMode: true,
  //swcMinify: true, // ver12以降デフォルトで有効
  experimental: {
    instrumentationHook: true,
    // newNextLinkBehavior: true,
  },
  // transpilePackages: [
  //     "@refinedev/antd",
  //     "@refinedev/inferencer",
  //     "antd",
  //     "@ant-design/pro-components",
  //     "@ant-design/pro-layout",
  //     "@ant-design/pro-utils",
  //     "@ant-design/pro-provider",
  //     "rc-pagination",
  //     "rc-picker",
  // ],
}

module.exports = nextConfig
