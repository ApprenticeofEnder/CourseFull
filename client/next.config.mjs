/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    async rewrites() {
        const prodProxies = [
            {
                source: '/random-image',
                destination:
                    'https://randomimagedesc.creativegunfilms.workers.dev/',
            },
        ];
        const devProxies = [
            ...prodProxies,
            {
                source: '/api/v1/:endpoint*',
                destination: 'http://localhost:8080/api/v1/:endpoint*',
            },
        ];
        return process.env.NODE_ENV === 'production' ? prodProxies : devProxies;
    },
    reactStrictMode: false,
};

export default nextConfig;
