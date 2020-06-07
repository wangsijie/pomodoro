import moment from 'moment';
import oss from './oss';
import { getUserByName, getUserById, getUserByGithub, updateUser as _updateUser, createUser as _createUser } from './fauna';

const DB_CAT = 'category';
const DB_ISSUE = 'issue';

export async function getUser(where = {}) {
    if (where.name) {
        const user = await getUserByName(where.name);
        if (user && user.password === where.password) {
            return user;
        }
        return null;
    }
    if (where.githubLogin) {
        return await getUserByGithub(where.githubLogin);
    }
    return await getUserById(where.id);
}

export async function updateUser(data) {
    return _updateUser(data.id, data);
}

export async function createUser(data) {
    return _createUser({
        ...data,
        createdAt: moment().format(),
    });
}

export async function getIssues(userId) {
    if (!userId) {
        throw new Error('userId needed');
    }
    const lastOne = 9999999999999 - moment().startOf('isoWeek').unix() * 1000;
    const items = await oss.find(DB_ISSUE + '-' + userId, lastOne);
    return items.map(item => ({
        ...item,
        content: item.content || '',
    }));
}

export async function getIssue(userId, id) {
    return oss.get(DB_ISSUE + '-' + userId, id);
}

export async function addIssue({ title, category, content, userId }) {
    return oss.save(DB_ISSUE + '-' + userId, {
        title,
        content,
        category,
        tags: [],
        createdAt: moment().format(),
        userId,
    });
}

export async function updateIssue(userId, data) {
    return oss.save(DB_ISSUE + '-' + userId, data);
}

export async function deleteIssue(userId, id) {
    return oss.remove(DB_ISSUE + '-' + userId, id);
}

export async function addCategory({ title, key, color, fontColor, userId }) {
    return oss.save(DB_CAT + '-' + userId, {
        title, key, color, fontColor,
        createdAt: moment().format(),
        userId,
    });
}

export async function getCategories(where = {}) {
    const items = await oss.find(DB_CAT + '-' + where.userId);
    return items.map(item => ({
        ...item,
        targets: item.targets || [0, 0, 0, 0, 0, 0, 0],
    }));
}

export async function getCategory(userId, id) {
    return oss.get(DB_CAT + '-' + userId, id);
}

export async function updateCategory(userId, data) {
    return oss.save(DB_CAT + '-' + userId, data);
}

export async function deleteCategory(userId, id) {
    return oss.remove(DB_CAT + '-' + userId, id);
}
