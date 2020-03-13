import tcb from 'tcb-admin-node'

let app;
function getApp() {
    if (app) {
        return app;
    }
    app = tcb.init({
        env: process.env.TCB_ENV,
        secretId: process.env.TCB_AK,
        secretKey: process.env.TCB_SK,
    });
    return app;
}

export default getApp;
