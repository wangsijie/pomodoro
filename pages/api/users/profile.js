import nextCookie from 'next-cookies'
import { getInfo } from '../../../helper/token'

export default async (req, res) => {
    const { token } = nextCookie({ req });
    const user = token && await getInfo(token);
    if (!user) {
        res.statusCode = 401;
        return res.end();
    }
    res.json(user);
}
