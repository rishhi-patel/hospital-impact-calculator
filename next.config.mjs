/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  reactStrictMode: true,
  webpack(config, { isServer }) {
    // Add a custom Webpack rule to ignore source map files from chrome-aws-lambda
    if (!isServer) {
      config.module.rules.push({
        test: /\.map$/,
        use: "null-loader",
      })
    }

    return config
  },
}

export default nextConfig
