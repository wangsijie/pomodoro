import { updateCategory, deleteCategory, getCategory } from '../../../helper/db';
import { apiAuth } from '../../../helper/token';

export default async (req, res) => {
    const user = apiAuth(req);
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

    const category = await getCategory(id);
    if (!category || category.userId !== user.id) {
        res.statusCode = 401;
        res.end();
        return;
    }

    if (req.method === 'PATCH') {
        const result = await updateCategory(id, req.body);
        res.statusCode = 201;
        res.json(result);
    }
    if (req.method === 'DELETE') {
        await deleteCategory(id);
        res.statusCode = 200;
        res.end();
    }
}
