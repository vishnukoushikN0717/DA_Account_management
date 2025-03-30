/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  async rewrites() {
    return [
      // Entity API rewrites (added for CORS handling)
      {
        source: '/api/Entity/:path*',
        destination: 'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/Entity/:path*',
      },
      // Existing rewrites
      {
        source: '/api/Contact',
        destination: 'https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Contact',
      },
      {
        source: '/api/Contact/:path*',
        destination: 'https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Contact/:path*',
      },
      {
        source: '/api/Practitioner/:path*',
        destination: 'https://dawavpersona-hvgye7gjbmf6h6fu.eastus-01.azurewebsites.net/api/Practitioner/:path*',
      },
      {
        source: '/api/AccountManager/WAVInternalUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/WAVInternalUser/:path*`,
      },
      {
        source: '/api/AccountManager/WAVExternalUser/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL_EXTERNAL}/api/WAVExternalUser/:path*`,
      },
      {
        source: '/api/EntityLinking/:path*',
        destination: 'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/EntityLinking/:path*',
      },
      {
        source: '/api/EntityUnlinking/:path*',
        destination: 'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/EntityLinking/unlink/:path*',
      },
      {
        source: '/api/EntityData/:path*',
        destination: 'https://dawaventity-g5a6apetdkambpcu.eastus-01.azurewebsites.net/api/:path*',
      }
    ];
  },
  experimental: {
    // appDir: true,
  },
};

module.exports = nextConfig;