module.exports = {
    envId: 'pomodoro-xxxx',
    functionRoot: '../',
    functions: [
        {
            name: 'pomodoro',
            config: {
                // 超时时间
                timeout: 5,
                // 环境变量
                envVariables: {
                    JWT_KEY: 'xxxxxxxx',
                },
                runtime: 'Nodejs8.9',
                installDependency: true,
            },
            handler: 'index.main',
            ignore: ['node_modules', 'node_modules/**/*', '.git']
        }
    ]
}
