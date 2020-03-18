import axios from 'axios';
import { message } from 'antd';

function resolveError(e) {
    if (!e.response) {
        throw e;
    }
    message.error(e.response.data);
    throw e;
}

export const $post = async function (endpoint, data) {
    try {
        return await axios.post(
            `${process.env.API_ROOT}/api${endpoint}`,
            data,
        );
    } catch (e) {
        resolveError(e);
    }
}

export const $patch = async function (endpoint, data) {
    try {
        return await axios.patch(
            `${process.env.API_ROOT}/api${endpoint}`,
            data,
        );
    } catch (e) {
        resolveError(e);
    }
}

export const $get = async function (endpoint) {
    try {
        const res = await axios.get(
            `${process.env.API_ROOT}/api${endpoint}`,
        );
        return res.data;
    } catch (e) {
        resolveError(e);
    }
}

export const $delete = async function (endpoint) {
    try {
        const res = await axios.delete(
            `${process.env.API_ROOT}/api${endpoint}`,
        );
        return res.data;
    } catch (e) {
        resolveError(e);
    }
}
