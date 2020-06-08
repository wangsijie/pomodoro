import moment from 'moment';
import { query, q } from './fauna';

export async function getUser(where = {}) {
    if (where.name) {
        const user = await query(
            q.Get(
                q.Match(q.Index('users_by_name'), where.name)
            )
        );;
        if (user && user.password === where.password) {
            return user;
        }
        return null;
    }
    if (where.githubLogin) {
        return await query(
            q.Get(
                q.Match(q.Index('users_by_github'), where.githubLogin)
            )
        );;
    }
    return await query(
        q.Get(
            q.Ref(q.Collection('user'), where.id)
        )
    );;
}

export async function updateUser(data) {
    const id = data.id;
    delete data.id;
    return query(
        q.Update(
            q.Ref(q.Collection('user'), id),
            { data },
        )
    );
}

export async function createUser(data) {
    return query(
        q.Create(
            q.Collection('user'),
            { data },
        )
    )
}

export async function getIssues(userId) {
    if (!userId) {
        throw new Error('userId needed');
    }
    const week = moment().startOf('isoWeek');
    const result = [];
    let after;
    do {
        const [items, _after] = await query(
            q.Map(
                q.Paginate(
                    q.Match(q.Index('issues_by_userId'), userId),
                    { after },
                ),
                x => q.Get(x),
            ),
            { withAfter: true, parseArray: true },
        );
        result.push(...items.filter(item => moment(item.time).isAfter(week)));
        if (items.find(item => moment(item.time).isBefore(week))) {
            after = _after;
        }
    } while (after);
    return result;
}

export async function getIssue(userId, id) {
    const item = await query(
        q.Get(
            q.Ref(q.Collection('issue'), id)
        )
    );
    if (!item) {
        return null;
    }
    if (item.userId !== userId) {
        return null;
    }
    return item;
}

export async function addIssue({ title, categoryId, content, userId }) {
    return query(
        q.Create(
            q.Collection('issue'),
            {
                data: {
                    title,
                    content,
                    categoryId,
                    tags: [],
                    createdAt: moment().format(),
                    userId,
                },
            }
        )
    )
}

export async function updateIssue(userId, data) {
    const issue = await getIssue(userId, data.id);
    if (issue) {
        const id = data.id;
        delete data.id;
        return query(
            q.Update(
                q.Ref(q.Collection('issue'), id),
                { data },
            )
        );
    }
    throw new Error('not found');
}

export async function deleteIssue(userId, id) {
    const issue = await getIssue(userId, id);
    if (!issue) {
        throw new Error('not found');
    }
    return query(
        q.Delete(q.Ref(q.Collection('issue'), id))
    )
}

export async function addCategory({ title, key, color, fontColor, userId }) {
    return query(
        q.Create(
            q.Collection('category'),
            {
                data: {
                    title, key, color, fontColor,
                    targets: [0, 0, 0, 0, 0, 0, 0],
                    createdAt: moment().format(),
                    userId,
                },
            }
        )
    )
}

export async function getCategories(where = {}) {
    return query(
        q.Map(
            q.Paginate(
                q.Match(q.Index('categories_by_userId'), where.userId)
            ),
            x => q.Get(x),
        ),
        { parseArray: true },
    )
}

export async function getCategory(userId, id) {
    const item = await query(
        q.Get(
            q.Ref(q.Collection('category'), id)
        )
    );
    if (!item) {
        return null;
    }
    if (item.userId !== userId) {
        return null;
    }
    return item;
}

export async function updateCategory(userId, data) {
    const category = await getCategory(userId, data.id);
    if (category) {
        const id = data.id;
        delete data.id;
        return query(
            q.Update(
                q.Ref(q.Collection('category'), id),
                { data },
            )
        );
    }
    throw new Error('not found');
}

export async function deleteCategory(userId, id) {
    const category = await getCategory(userId, id);
    if (!category) {
        throw new Error('not found');
    }
    return query(
        q.Delete(q.Ref(q.Collection('category'), id))
    )
}
