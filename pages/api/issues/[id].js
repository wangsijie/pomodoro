import { updateIssue, deleteIssue, getIssue } from '../../../helper/db';
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

    const issue = await getIssue(id);
    if (!issue || issue.userId !== user.id) {
        res.statusCode = 401;
        res.end();
        return;
    }

    if (req.method === 'PATCH') {
        const { content } = req.body;
        const result = await updateIssue(id, { content });
        res.statusCode = 201;
        res.json(result);
    }
    if (req.method === 'DELETE') {
        await deleteIssue(id);
        res.statusCode = 200;
        res.end();
    }
}
