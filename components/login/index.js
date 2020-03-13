import { useState } from 'react';
import { Input, Button } from 'antd';
import './login.less';
import { $post, setToken } from '../../helper/remote';
import Layout from '../layout';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        const res = await $post('/users/login', { username, password });
        setToken(res.data);
        window.location.reload();
    }

    return <Layout><div className="login-card">
        <div className="form">
            <div className="form-row">
                <Input onChange={e => setUsername(e.target.value)} value={username} placeholder="用户名" />
            </div>
            <div className="form-row">
                <Input type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="密码" />
            </div>
            <div className="form-row">
                <Button disabled={!username || !password} onClick={login} type="primary">登录</Button>
            </div>
        </div>
    </div></Layout>;
}
