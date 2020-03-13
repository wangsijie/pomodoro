import { login } from "../../../helper/token";

export default async (req, res) => {
    if (req.method === 'POST') {
        const { username, password } = req.body;
        if (!username || !password) {
            res.statusCode = 403;
            res.end();
            return;
        }
        const token = await login(username, password);
        if (!token) {
            res.statusCode = 403;
            res.end('用户名或密码错误');
            return;
        }
        res.statusCode = 201;
        res.end(token);
        return;
    }
    res.statusCode = 404;
    res.end();
}
