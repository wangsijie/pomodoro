export default async (req, res) => {
    res.setHeader('set-cookie', 'token=deleted; HttpOnly; Path=/; Max-Age=0');
    res.statusCode = 302;
    res.setHeader('location', '/');
    res.end();
}
