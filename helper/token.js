import jwt from 'jsonwebtoken';
import nextCookies from 'next-cookies';
import { getUser } from './db';

const key = process.env.JWT_KEY || 'jwt-local-key';

export const login = async (name, password) => {
    const user = await getUser({ name, password })
    if (!user) {
        return null;
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
