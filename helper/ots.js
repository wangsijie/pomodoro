import ETS from 'easy-tablestore';

let client;
export const getClient = () => {
    if (client) {
        return client;
    }
    client = new ETS({
        accessKeyId: process.env.OTS_AK,
        accessKeySecret: process.env.OTS_SK,
        endpoint: process.env.OTS_ENDPOINT,
        instancename: process.env.OTS_INSTANCE,
    });
    return client;
}
