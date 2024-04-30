/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
    },
    // Miiiight need this later? not sure
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/v1/:endpoint*',
    //             destination: 'http://localhost:8080/api/v1/:endpoint*',
    //         },
    //     ];
    // },
};

export default nextConfig;
