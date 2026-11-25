/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  serverExternalPackages: ['nodemailer'],
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;
