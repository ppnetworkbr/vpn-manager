/** @type {import('next').NextConfig} */
const nextConfig = {
  unstable_allowDynamic: ['./auth.ts'],
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
