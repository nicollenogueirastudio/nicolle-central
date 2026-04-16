/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'scontent.cdninstagram.com',
      'i.ytimg.com',
      'i.pinimg.com',
      'substackcdn.com',
    ],
  },
}

module.exports = nextConfig
