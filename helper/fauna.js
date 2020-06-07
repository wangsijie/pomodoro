import faunadb, { query as q } from 'faunadb';

const client = new faunadb.Client({ secret: process.env.FAUNA_KEY });

async function query(req) {
    try {
        const ret = await client.query(req);
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

export function getUserByName(name) {
    return query(
        q.Get(
            q.Match(q.Index('users_by_name'), name)
        )
    );
}

export function getUserById(id) {
    return query(
        q.Get(
            q.Ref(q.Collection('user'), id)
        )
    );
}

export function getUserByGithub(githubLogin) {
    return query(
        q.Get(
            q.Match(q.Index('users_by_github'), githubLogin)
        )
    );
}

export function updateUser(id, data) {
    delete data.id;
    return query(
        q.Update(
            q.Ref(q.Collection('user', id)),
            { data },
        )
    );
}

export function createUser(data) {
    return query(
        q.Create(
            q.Collection('user'),
            { data },
        )
    )
}
