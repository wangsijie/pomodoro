import { useState } from 'react';
import { Input, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './login.less';
import { $post } from '../../helper/remote';
import Layout from '../layout';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        await $post('/users/login', { username, password });
        window.location.reload();
    }

    const loginWithGithub = () => {
        const clientId = process.env.GITHUB_CLIENT_ID;
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user`;
    }

    return <Layout><div className="login-card">
        <Button className="github" size="large" icon={<GithubOutlined />} onClick={loginWithGithub} type="primary">GitHub 登录</Button>
    </div></Layout>;
}
