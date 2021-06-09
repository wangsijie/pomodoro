import moment from 'moment';
import { TS } from 'easy-tablestore';
import { getClient } from './ots';

export async function getIssues(userId) {
    if (!userId) {
        throw new Error('userId needed');
    }
    const week = moment().startOf('isoWeek');
    return await getClient().getRows(
        'issue',
        {
            userId,
            id: week.unix() * 1000000,
        },
        {
            userId,
            id: TS.INF_MAX,
        },
    );
}

export async function getIssue(userId, id) {
    return await getClient().getRow('issue', { userId, id });
}

export async function addIssue({ title, categoryId, userId }) {
    return await getClient().putRow(
        'issue',
        {
            userId,
            id: TS.PK_AUTO_INCR,
        },
        {
            title,
            categoryId,
            time: new Date().getTime(),
        },
    )
}

export async function updateIssue(userId, data) {
    const issue = await getIssue(userId, data.id);
    if (issue) {
        delete data.id,
        delete data.userId
        await getClient().putRow(
            'issue',
            {
                userId,
                id: issue.id
            },
            {
                ...data,
            },
        );
    }
    throw new Error('not found');
}

export async function deleteIssue(userId, id) {
    const issue = await getIssue(userId, id);
    if (!issue) {
        throw new Error('not found');
    }
    await getClient().deleteRow('issue', { userId, id });
}

export async function addCategory({ title, color, fontColor, userId }) {
    return await getClient().putRow(
        'category',
        {
            userId,
            id: TS.PK_AUTO_INCR,
        },
        {
            title,
            color,
            fontColor,
            targets: JSON.stringify([0, 0, 0, 0, 0, 0, 0]),
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
        targets: JSON.parse(category.targets),
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
        targets: JSON.parse(category.targets),
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
                targets: JSON.stringify(data.targets),
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
