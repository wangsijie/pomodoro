import { getIssues, addIssue } from '../../../helper/db';
import { apiAuth } from '../../../helper/token';

export default async (req, res) => {
    const user = await apiAuth(req);
    if (!user) {
        res.statusCode = 401;
        res.end();
        return;
    }
    if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(await getIssues(user.id)));
        return;
    }
    if (req.method === 'POST') {
        const { title, categoryId, content } = req.body;
        if (!title || !categoryId) {
            res.statusCode = 403;
            res.end();
            return;
        }
        await addIssue({ title, categoryId, userId: user.id, content });
        res.statusCode = 201;
        res.end();
    }
}
