import { getIssues, addIssue } from '../../../helper/db';
import { apiAuth } from '../../../helper/token';

export default async (req, res) => {
    const user = apiAuth(req);
    if (!user) {
        res.statusCode = 401;
        res.end();
        return;
    }
    if (req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(await getIssues({ userId: user.id })));
        return;
    }
    if (req.method === 'POST') {
        const { title, category } = req.body;
        if (!title || !category) {
            res.statusCode = 403;
            res.end();
            return;
        }
        await addIssue({ title, category, userId: user.id });
        res.statusCode = 201;
        res.end();
    }
}
