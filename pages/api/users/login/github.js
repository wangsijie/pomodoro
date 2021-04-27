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
        const { access_token } = await requestAccessToken(code);
        accessToken = access_token;
    } else if (pat) {
        accessToken = pat;
    } else {
        res.statusCode = 400;
        return res.end();
    }
    const githubUser = await getUserInfo(accessToken);
    const { login, avatar_url: avatar, name, email } = githubUser;
    const token = await loginWithGithub(login, accessToken, name, email, avatar);
    res.statusCode = 302;
    res.setHeader('location', '/');
    res.setHeader('set-cookie', `token=${token}; HttpOnly; Path=/`);
    res.end();
}
