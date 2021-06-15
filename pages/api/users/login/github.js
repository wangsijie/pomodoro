import { requestAccessToken, getUserInfo } from "../../../../helper/github";
import { loginWithGithub } from "../../../../helper/token";

export default async (req, res) => {
    if (req.method !== 'GET') {
        res.statusCode = 404;
        return res.end();
    }
    let accessToken;
    const { code, pat } = req.query;
    if (code) {
        const data = await requestAccessToken(code);
        const { access_token } = data;
        if (!access_token) {
            throw new Error('GitHub登陆失败' + JSON.stringify(data));
        }
        accessToken = access_token;
    } else if (pat) {
        accessToken = pat;
    } else {
        res.statusCode = 400;
        return res.end();
    }
    const token = await loginWithGithub(accessToken);
    res.statusCode = 302;
    res.setHeader('location', '/');
    res.setHeader('set-cookie', `token=${token}; HttpOnly; Path=/`);
    res.end();
}
