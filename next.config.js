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
            GH_ID: process.env.GH_ID,
        },
    };
    if (phase !== PHASE_DEVELOPMENT_SERVER) {
        // config.env = {
        //     API_ROOT: '',
        // };
    }
    return withLess(config)
}
