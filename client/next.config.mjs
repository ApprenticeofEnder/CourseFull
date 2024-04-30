/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    async rewrites() {
        const proxies = [
            {
                source: '/api/v1/:endpoint*',
                destination: 'http://localhost:8080/api/v1/:endpoint*',
            },
        ];
        return process.env.NODE_ENV === 'production' ? [] : proxies;
    },
};

export default nextConfig;
