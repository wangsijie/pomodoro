const OSS = require('ali-oss');

let client;
function getClient() {
    if (client) {
        return client;
    }
    client = new OSS({
        endpoint: process.env.OSS_ENDPOINT,
        accessKeyId: process.env.OSS_AK,
        accessKeySecret: process.env.OSS_SK,
        bucket: process.env.OSS_BUCKET,
    });
    return client;
}
const prefix = process.env.OSS_PREFIX;

const idGenerator = () => 9999999999999 - new Date().getTime();
const resolveName = name => {
    if (/\.json$/.test(name)) {
        return name;
    }
    return name + '.json';
}

async function getContent(name) {
    const res = await getClient().get(prefix + name);
    return res.res.data.toString();
}

async function setContent(name, value) {
    return getClient().put(prefix + name, Buffer.from(value));
}

async function deleteContent(name) {
    return getClient().delete(prefix + name);
}

const setJson = async (name, json) => {
    return setContent(resolveName(name), Buffer.from(JSON.stringify(json, null, 2)));
}

const getJson = async (name) => {
    const content = await getContent(resolveName(name));
    try {
        return JSON.parse(content);
    } catch (e) {
        return null;
    }
}

async function getObjects(subprefix, end) {
    let marker;
    const objects = [];
    do {
        const result = await getClient().list({
            prefix: prefix + subprefix,
            marker,
        });
        if (!result.objects) {
            return [];
        }
        marker = result.nextMarker;
        if (end) {
            const idSearch = /\/(\d*)\.json/.exec(marker);
            const id = idSearch && idSearch[1];
            if (id && id > end) {
                marker = null;
            }
        }
        objects.push(
            ...result.objects
                .filter(object => !/\/$/.test(object.name))
                .filter(object => {
                    if (!end) {
                        return true;
                    }
                    const idSearch = /\/(\d*)\.json/.exec(object.name);
                    const id = idSearch && idSearch[1];
                    return id && id <= end;
                })
        );
    } while (marker);
    return Promise.all(objects.map(object => getJson(object.name.replace(prefix, ''))));
}

exports.save = async (collection, data) => {
    const id = data._id || idGenerator();
    const payload = { ...data, _id: id };
    await setJson(`${collection}/${id}`, payload);
}

exports.get = async (collection, id) => {
    return getJson(`${collection}/${id}`);
}

exports.find = async (collection, end) => {
    return getObjects(collection + '/', end)
}

exports.remove = async (collection, id) => {
    return deleteContent(`${collection}/${resolveName(id)}`);
}
