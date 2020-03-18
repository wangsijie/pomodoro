import React from 'react';
import { Button, Popover } from 'antd';
// import { UserOutlined } from '@ant-design/icons';

export default function UserInfo({ user }) {
    const handleLogout = () => {
        window.location.href = '/api/users/logout';
    }

    return <Popover
        trigger="click"
        content={<Button type="danger" onClick={handleLogout} style={{ width: 180 }}>注销</Button>}
        title={user.githubName}
        placement="bottomLeft"
    >
        {/* <Button icon={<UserOutlined />}></Button> */}
        <img width="32px" height="32px" style={{
            borderRadius: '2px',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.015)',
            border: '1px solid rgb(217, 217, 217)',
            cursor: 'pointer',
        }} src={user.githubAvatar} alt="avatar" />
    </Popover>
}
