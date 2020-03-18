import moment from 'moment';
import tcb from './tcb';

const DB_CAT = 'pomodoro-category';
const DB_USER = 'pomodoro-user';

export async function getUser(where = {}) {
    const db = tcb().database()
    const res = await db.collection(DB_USER).where(where).get();
    return res.data && res.data[0];
}

export async function updateUser(id, data) {
    const db = tcb().database();
    return db.collection(DB_USER).doc(id).update(data)
}

export async function createUser(data) {
    const db = tcb().database();
    const idCount = await db.collection(DB_USER).count();
    return db.collection(DB_USER).add({
        ...data,
        id: idCount.total + 1,
        createdAt: moment().format(),
    });
}

export async function getIssues(where = {}) {
    if (!where.userId) {
        throw new Error('userId needed');
    }
    const db = tcb().database();
    const _ = db.command;
    const start = moment().startOf('isoWeek').format();
    const res = await db.collection('pomodoro').where({
        createdAt: _.gt(start),
        ...where,
    }).get();
    return res.data.map(item => ({
        ...item,
        content: item.content || '',
    }));
}

export async function getIssue(id) {
    const db = tcb().database();
    const res = await db.collection('pomodoro').doc(id).get();
    return res.data && res.data[0];
}

export async function addIssue({ title, category, content, userId }) {
    const db = tcb().database();
    return db.collection('pomodoro').add({
        title,
        content,
        category,
        tags: [],
        createdAt: moment().format(),
        userId,
    })
}

export async function updateIssue(id, data) {
    const db = tcb().database();
    return db.collection('pomodoro').doc(id).update(data)
}

export async function deleteIssue(id) {
    const db = tcb().database();
    return db.collection('pomodoro').doc(id).remove()
}

export async function addCategory({ title, key, color, fontColor, userId }) {
    const db = tcb().database();
    return db.collection(DB_CAT).add({
        title, key, color, fontColor,
        createdAt: moment().format(),
        userId,
    });
}

export async function getCategories(where = {}) {
    const db = tcb().database();
    const res = await db.collection(DB_CAT).where(where).get();
    return res.data.map(item => ({
        ...item,
        targets: item.targets || [0, 0, 0, 0, 0, 0, 0],
    }));
}

export async function getCategory(id) {
    const db = tcb().database();
    const res = await db.collection(DB_CAT).doc(id).get();
    return res.data && res.data[0];
}

export async function updateCategory(id, data) {
    const db = tcb().database();
    return db.collection(DB_CAT).doc(id).update(data)
}

export async function deleteCategory(id) {
    const db = tcb().database();
    return db.collection(DB_CAT).doc(id).remove()
}
