/** @type {import('next').NextConfig} */
export default {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'evrjimpvbkritkiantsx.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
}
