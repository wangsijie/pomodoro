import { updateIssue, deleteIssue, getIssue } from '../../../helper/db';
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

    const issue = await getIssue(user.id, id);
    if (!issue || issue.userId !== user.id) {
        res.statusCode = 401;
        res.end();
        return;
    }

    if (req.method === 'PATCH' || req.method === 'POST') { // tencent cloudbase don't support PATCH
        const { content } = req.body;
        await updateIssue(user.id, {
            ...issue,
            content,
        });
        res.statusCode = 201;
        res.json(await getIssue(user.id, id));
    }
    if (req.method === 'DELETE') {
        await deleteIssue(user.id, id);
        res.statusCode = 200;
        res.end();
    }
}
