/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node$/,
      use: 'file-loader',
    })

    return config
  },
}

export default nextConfig
