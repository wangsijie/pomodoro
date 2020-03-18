import { requestAccessToken, getUserInfo } from "../../../../helper/github";
import { loginWithGithub } from "../../../../helper/token";

export default async (req, res) => {
    if (req.method === 'GET') {
        const { code } = req.query;
        if (!code) {
            res.statusCode = 401;
            res.end();
            return;
        }
        const { access_token: accessToken } = await requestAccessToken(code);
        const githubUser = await getUserInfo(accessToken);
        const { login, avatar_url: avatar, name, email } = githubUser;
        const token = await loginWithGithub(login, accessToken, name, email, avatar);
        res.statusCode = 302;
        res.setHeader('location', '/');
        res.setHeader('set-cookie', `token=${token}; HttpOnly; Path=/`);
        res.end();
        return;
    }
    res.statusCode = 404;
    res.end();
}
