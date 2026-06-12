/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Fix for chunk loading issues
  trailingSlash: false,
  distDir: '.next',
  
  // Generate stable chunk filenames for better caching
  generateBuildId: () => 'build',
  
  // Security and performance
  poweredByHeader: false,
  generateEtags: false,
  
  // /proxe was extracted to its own standalone Next app at goproxe.com.
  // Permanent redirect (308) preserves SEO and any external inbound links.
  async redirects() {
    return [
      {
        source: '/proxe',
        destination: 'https://goproxe.com',
        permanent: true,
      },
      {
        source: '/proxe/:path*',
        destination: 'https://goproxe.com/:path*',
        permanent: true,
      },
      {
        source: '/gpfc-ai-lead-machine',
        destination: '/lead-machine',
        permanent: true,
      },
    ];
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'player.vimeo.com',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
    // Allow local images
    unoptimized: false,
  },

  // Webpack configuration for GSAP and Three.js
  webpack: (config, { isServer }) => {
    // Fix for Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // GSAP configuration
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: 'asset/source',
    });

    return config;
  },

  // Experimental features (if needed)
  experimental: {
    // serverActions: true, // For Next.js 14 server actions
  },

  // Output configuration
  // output: 'standalone', // Commented out to fix routing issues

  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
    NEXT_PUBLIC_GIT_COMMIT_HASH: process.env.NEXT_PUBLIC_GIT_COMMIT_HASH,
    NEXT_PUBLIC_GIT_COMMIT_MESSAGE: process.env.NEXT_PUBLIC_GIT_COMMIT_MESSAGE,
    NEXT_PUBLIC_GIT_BRANCH: process.env.NEXT_PUBLIC_GIT_BRANCH,
    NEXT_PUBLIC_RELEASE_DATE: process.env.NEXT_PUBLIC_RELEASE_DATE,
  },
};

module.exports = nextConfig;



