import jwt from 'jsonwebtoken';
import nextCookies from 'next-cookies';
import { getUser, createUser, updateUser } from './db';

const key = process.env.JWT_KEY || 'jwt-local-key';

export const login = async (name, password) => {
    if (!name || !password) {
        return null;
    }
    const user = await getUser({ name, password })
    if (!user) {
        return null;
    }
    return jwt.sign({
        uid: user.id,
    }, key, { expiresIn: '7d' });
}

export const loginWithGithub = async (login, token, name, email, avatar) => {
    if (!login || login.length < 2) {
        return null;
    }
    let user = await getUser({ githubLogin: login })
    if (!user) {
        user = await createUser({ githubLogin: login, githubToken: token, githubName: name, githubEmail: email, githubAvatar: avatar });
    } else {
        await updateUser(user._id, { githubToken: token, githubName: name, githubEmail: email, githubAvatar: avatar });
    }
    return jwt.sign({
        uid: user.id,
    }, key, { expiresIn: '7d' });
}

export const getInfo = async (token) => {
    try {
        const data = jwt.verify(token, key);
        if (!data || !data.uid) {
            return null;
        }
        const user = await getUser({ id: data.uid });
        if (!user) {
            return null;
        }
        delete user.password;
        delete user.githubToken;
        return user;
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
