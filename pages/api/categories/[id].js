import { updateCategory, deleteCategory, getCategory } from '../../../helper/db';
import { apiAuth } from '../../../helper/token';

export default async (req, res) => {
    const user = await apiAuth(req);
    if (!user) {
        res.statusCode = 401;
        res.end();
        return;
    }

    const { id } = req.query;
    if (!id) {
        res.statusCode = 404;
        res.end();
        return;
    }

    const category = await getCategory(user.id, id);
    if (!category) {
        res.statusCode = 401;
        res.end();
        return;
    }

    if (req.method === 'PATCH' || req.method === 'POST') { // tencent cloudbase don't support PATCH
        await updateCategory(user.id, {
            ...category,
            ...req.body,
            _id: category._id,
        });
        res.statusCode = 201;
        res.json(await getCategory(user.id, id));
    }
    if (req.method === 'DELETE') {
        await deleteCategory(user.id, id);
        res.statusCode = 200;
        res.end();
    }
}
