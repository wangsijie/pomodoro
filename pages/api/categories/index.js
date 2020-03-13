import { addCategory, getCategories } from '../../../helper/db';
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
        res.json(await getCategories({ userId: user.id }));
        return;
    }
    if (req.method === 'POST') {
        const { title, key, color, fontColor } = req.body;
        if (!title || !key) {
            res.statusCode = 403;
            res.end();
            return;
        }
        await addCategory({ title, key, color, fontColor, userId: user.id });
        res.statusCode = 201;
        res.end();
    }
}
