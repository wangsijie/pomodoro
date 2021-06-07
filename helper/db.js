import moment from 'moment';
import UUID from 'readableuuid';
import { TS } from 'easy-tablestore';
import { getClient } from './ots';
import { query, q } from './fauna';

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
        result.push(...(items.filter(item => moment(item.createdAt).isAfter(week))));
        if (!items.find(item => moment(item.createdAt).isBefore(week))) {
            after = _after;
        } else {
            after = null;
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

export async function addCategory({ title, color, fontColor, userId }) {
    return await getClient().putRow(
        'category',
        {
            userId,
            id: UUID(),
        },
        {
            title,
            color,
            fontColor,
        },
    );
}

export async function getCategories(userId) {
    return (await getClient().getRows(
        'category',
        {
            userId,
            id: TS.INF_MIN,
        },
        {
            userId,
            id: TS.INF_MAX,
        },
    )).map(category => ({
        ...category,
        targets: category.targets ? JSON.parse(category.targets) : [0, 0, 0, 0, 0, 0, 0],
    }));
}

export async function getCategory(userId, id) {
    const category =  await getClient().getRow(
        'category',
        {
            userId,
            id,
        },
    );
    return {
        ...category,
        targets: category.targets ? JSON.parse(category.targets) : [0, 0, 0, 0, 0, 0, 0],
    };
}

export async function updateCategory(userId, data) {
    const category = await getCategory(userId, data.id);
    if (category) {
        const id = data.id;
        delete data.id;
        delete data.userId;
        return await getClient().putRow(
            'category',
            {
                userId,
                id,
            },
            {
                ...data,
                targets: JSON.stringify(data.targets || [0, 0, 0, 0, 0, 0, 0]),
            },
        );
    }
    throw new Error('not found');
}

export async function deleteCategory(userId, id) {
    const category = await getCategory(userId, id);
    if (!category) {
        throw new Error('not found');
    }
    return await getClient().deleteRow(
        'category',
        {
            userId,
            id,
        },
    );
}
