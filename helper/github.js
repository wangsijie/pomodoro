import axios from 'axios';

export const CLIENT_ID = process.env.GH_ID;
export const CLIENT_SECRET = process.env.GH_SK;

export const requestAccessToken = async (code) => {
    const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
        },
        {
            headers: {
                accept: 'application/json',
            }
        },
    );
    return res.data;
}

export const getUserInfo = async (token) => {
    const res = await axios.get('https://api.github.com/user', { headers: { authorization: `bearer ${token}` } });
    return res.data;
}
