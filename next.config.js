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
}

module.exports = nextConfig
