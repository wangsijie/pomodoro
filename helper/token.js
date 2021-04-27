import jwt from 'jsonwebtoken';
import nextCookies from 'next-cookies';
import { getUserInfo } from './github';

const key = process.env.JWT_KEY || 'jwt-local-key';

export const loginWithGithub = async (token) => {
    return jwt.sign({
        gh_token: token,
    }, key, { expiresIn: '7d' });
}

export const getInfo = async (token) => {
    try {
        const data = jwt.verify(token, key);
        if (!data || !data.gh_token) {
            return null;
        }
        const githubInfo = await getUserInfo(data.gh_token);
        // 暂时不允许外部访问
        if (githubInfo.login !== 'wangsijie') {
            return null;
        }
        return {
            id: '267653441341358599',
            githubAvatar: githubInfo.avatar_url,
            githubLogin: githubInfo.login,
            githubName: githubInfo.name,
        };
    } catch (e) {
        return null;
    }
}

export const apiAuth = (req) => {
    const { token } = nextCookies({ req });
    if (!token) {
        return null;
    }
    return getInfo(token);
}
