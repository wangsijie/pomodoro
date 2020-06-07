import faunadb, { query as fquery } from 'faunadb';

export const client = new faunadb.Client({ secret: process.env.FAUNA_KEY });

const parseItem = ret => ({
    ...ret.data,
    id: ret.ref.value.id,
});

export async function query(req, { parseArray, withAfter } = {}) {
    try {
        const ret = await client.query(req);
        if (parseArray) {
            const data = ret.data.map(parseItem);
            if (withAfter) {
                return [data, ret.after];
            }
            return data;
        }
        if (ret.ref) {
            return {
                ...ret.data,
                id: ret.ref.value.id,
            }
        }
        return ret;
    } catch (e) {
        if (e.name === 'NotFound') {
            return null;
        }
        throw e;
    }
}

export const q = fquery;
