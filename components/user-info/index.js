import React from 'react';
import { Button, Popover } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { clearToken } from '../../helper/remote';

export default function UserInfo({ username }) {
    const handleLogout = () => {
        clearToken();
        window.location.reload();
    }

    return <Popover
        trigger="click"
        content={<Button type="danger" onClick={handleLogout} style={{ width: 180 }}>注销</Button>}
        title={username}
        placement="bottomLeft"
    >
        <Button icon={<UserOutlined />}></Button>
    </Popover>
}
