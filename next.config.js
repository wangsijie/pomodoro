const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')
const withLess = require('@zeit/next-less')

module.exports = (phase, { defaultConfig }) => {
    const config = {
        webpack: (config, { isServer }) => {
            if (!isServer) {
                config.module.rules.push({
                    test: /tcb-admin-node/,
                    use: "null-loader",
                });
                config.module.rules.push({
                    test: /tablestore/,
                    use: "null-loader",
                });
            }
            return config
        },
        env: {
            API_ROOT: '',
            JWT_KEY: process.env.JWT_KEY,
            GH_ID: process.env.GH_ID,
            GH_SK: process.env.GH_SK,
            OTS_AK: process.env.OTS_AK,
            OTS_SK: process.env.OTS_SK,
            OTS_ENDPOINT: process.env.OTS_ENDPOINT,
            OTS_INSTANCE: process.env.OTS_INSTANCE,
            GH_BASE_URL: process.env.GH_BASE_URL,
            GH_API_URL: process.env.GH_API_URL,
        },
    };
    if (phase !== PHASE_DEVELOPMENT_SERVER) {
        // config.env = {
        //     API_ROOT: '',
        // };
    }
    return withLess(config)
}
