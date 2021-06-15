import { useState } from 'react';
import { Input, Button } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './login.less';
import Layout from '../layout';

const clientId = process.env.GH_ID;

export default function Login() {
    const [pat, setPat] = useState('');
    const [loading, setLoading] = useState(false);

    const login = async () => {
        setLoading(true);
        window.location.href = `/api/users/login/github?pat=${pat}`;
    }

    const loginWithGithub = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=read:user`;
    }

    return <Layout><div className="login-card">
        {clientId ? <Button
            className="github"
            size="large"
            icon={<GithubOutlined />}
            onClick={loginWithGithub}
            type="primary"
        >GitHub 登录</Button> : <div className="form">
            <div className="form-row">
                <Input onChange={e => setPat(e.target.value)} value={pat} placeholder="PAT" />
            </div>
            <div className="form-row">
                <Button disabled={!pat} onClick={login} type="primary" loading={loading}>登录</Button>
            </div>
        </div>}
    </div></Layout>;
}
